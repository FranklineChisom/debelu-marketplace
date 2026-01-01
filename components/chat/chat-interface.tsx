"use client";

import { useState, useCallback } from "react";
import { useChatStore } from "@/stores";
import { ChatContainer } from "@/components/chat/chat-container";
import type { Message } from "@/types/chat";
import { isProductArray, isSearchResultObject } from "@/lib/chat/tools";

interface ChatInterfaceProps {
    sessionId: string;
    initialMessages: Message[];
}

/**
 * Simple Chat Interface with direct fetch
 * Handles tool results by parsing the response
 */
export function ChatInterface({ sessionId, initialMessages }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const setActivePanel = useChatStore((state) => state.setActivePanel);
    const setPanelData = useChatStore((state) => state.setPanelData);
    const addMessage = useChatStore((state) => state.addMessage);

    const log = useCallback((msg: string) => {
        console.log('[Chat]', msg);
        setDebugLogs(prev => [...prev.slice(-100), `${new Date().toLocaleTimeString()} | ${msg}`]);
    }, []);

    const handleSend = async (content: string) => {
        if (!content.trim() || isLoading) return;

        log(`SENDING: ${content}`);
        setError(null);

        // Add user message
        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        // Add placeholder for assistant
        const assistantId = crypto.randomUUID();
        const placeholder: Message = {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, placeholder]);

        try {
            // Call API
            log('Calling /api/chat...');
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            log(`Response status: ${response.status}`);

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Error ${response.status}: ${errText.slice(0, 100)}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            // Read stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let toolResults: unknown[] = [];
            let buffer = '';

            log('Reading stream...');

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    log('Stream done');
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete lines
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;

                    log(`LINE: ${line.substring(0, 80)}`);

                    // Try to parse as JSON first (fullStream format)
                    if (line.startsWith('{')) {
                        // Check if JSON is complete by counting braces
                        let braceCount = 0;
                        let inString = false;
                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            if (char === '"' && (i === 0 || line[i - 1] !== '\\')) inString = !inString;
                            if (!inString) {
                                if (char === '{') braceCount++;
                                if (char === '}') braceCount--;
                            }
                        }

                        if (braceCount !== 0) {
                            log(`Incomplete JSON (braceCount: ${braceCount}), buffering...`);
                            buffer = line + '\n' + buffer;
                            continue;
                        }

                        try {
                            const data = JSON.parse(line);

                            if (data.type === 'text-delta') {
                                fullText += data.textDelta || '';
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId
                                        ? { ...m, content: fullText }
                                        : m
                                ));
                            }
                            else if (data.type === 'tool-call') {
                                log(`TOOL CALL: ${data.toolName} args: ${JSON.stringify(data.input || data.args)}`);
                            }
                            else if (data.type === 'tool-result') {
                                log(`TOOL RESULT: ${data.toolName}`);
                                const result = data.output; // fullStream uses 'output' field
                                log(`Result type: ${typeof result}, isArray: ${Array.isArray(result)}`);
                                log(`Result preview: ${JSON.stringify(result).substring(0, 200)}`);
                                log(`isProductArray: ${isProductArray(result)}`);

                                toolResults.push({ toolCallId: data.toolCallId, toolName: data.toolName, result });

                                // Handle search results
                                if (data.toolName === 'search_marketplace') {
                                    if (isSearchResultObject(result)) {
                                        const { products, info } = result;
                                        // Construct intelligent message
                                        let msg = "";

                                        if (products.length > 0) {
                                            log(`Found ${products.length} products with metadata: ${JSON.stringify(info)}`);
                                            setActivePanel('intelligence');
                                            setPanelData({
                                                type: 'intelligence',
                                                products: products
                                            });

                                            msg = `I found ${products.length} products`;
                                            if (info.correctedQuery && info.correctedQuery !== info.originalQuery) {
                                                msg += ` for "${info.correctedQuery}" (corrected from "${info.originalQuery}")`;
                                            } else {
                                                msg += ` for "${info.originalQuery}"`;
                                            }
                                            if (info.intent) {
                                                msg += ` sorted by ${info.intent.toLowerCase().replace('sort: ', '')}`;
                                            }
                                            msg += `. Take a look!`;
                                        } else {
                                            // 0 Results
                                            msg = `I searched for "${info.correctedQuery || info.originalQuery}"`;
                                            if (info.correctedQuery && info.correctedQuery !== info.originalQuery) {
                                                msg += ` (corrected from "${info.originalQuery}")`;
                                            }
                                            msg += `, but I couldn't find any suitable matches in the marketplace.`;
                                        }

                                        // Add AI Reasoning if available
                                        if (info.reasoning) {
                                            msg += `\n\n🧠 **Thinking:** ${info.reasoning}`;
                                        }

                                        fullText = msg;
                                        setMessages(prev => prev.map(m =>
                                            m.id === assistantId
                                                ? { ...m, content: fullText }
                                                : m
                                        ));
                                    } else if (isProductArray(result)) {
                                        log(`Found ${result.length} products! Opening panel...`);
                                        setActivePanel('intelligence');
                                        setPanelData({
                                            type: 'intelligence',
                                            products: result
                                        });
                                        // Set a nice response text
                                        fullText = `I found ${result.length} products for you! Take a look at the options I've displayed.`;
                                        setMessages(prev => prev.map(m =>
                                            m.id === assistantId
                                                ? { ...m, content: fullText }
                                                : m
                                        ));
                                    } else if (typeof result === 'string') {
                                        log(`Result is string message`);
                                        fullText = result;
                                        setMessages(prev => prev.map(m =>
                                            m.id === assistantId
                                                ? { ...m, content: fullText }
                                                : m
                                        ));
                                    }
                                }
                            }
                            else if (data.type === 'finish') {
                                log(`FINISH: ${data.finishReason}`);
                            }
                            continue;
                        } catch {
                            // Not valid JSON, try other formats
                        }
                    }

                    // Vercel AI Data Stream Protocol formats
                    // Text content: 0:"text"
                    if (line.startsWith('0:')) {
                        try {
                            const text = JSON.parse(line.slice(2));
                            fullText += text;
                            setMessages(prev => prev.map(m =>
                                m.id === assistantId
                                    ? { ...m, content: fullText }
                                    : m
                            ));
                        } catch (e) {
                            log(`Parse error for text: ${e}`);
                        }
                    }
                    // Tool call: 9:{...}
                    else if (line.startsWith('9:')) {
                        log('TOOL CALL (9:) detected');
                        try {
                            const toolCall = JSON.parse(line.slice(2));
                            log(`Tool: ${toolCall.toolName} args: ${JSON.stringify(toolCall.args)}`);
                        } catch (e) {
                            log(`Parse error for tool call: ${e}`);
                        }
                    }
                    // Tool result: a:{...}
                    else if (line.startsWith('a:')) {
                        log('TOOL RESULT (a:) detected');
                        try {
                            const result = JSON.parse(line.slice(2));
                            log(`Result: ${JSON.stringify(result).substring(0, 100)}`);
                            toolResults.push(result);

                            // Handle search results
                            if (result.result) {
                                const toolOutput = result.result;

                                if (isSearchResultObject(toolOutput)) {
                                    const { products, info } = toolOutput;
                                    // Construct intelligent message
                                    let msg = "";

                                    if (products.length > 0) {
                                        log(`Found ${products.length} products (Stream)`);
                                        setActivePanel('intelligence');
                                        setPanelData({
                                            type: 'intelligence',
                                            products: products
                                        });

                                        msg = `I found ${products.length} products`;
                                        if (info.correctedQuery && info.correctedQuery !== info.originalQuery) {
                                            msg += ` for "${info.correctedQuery}" (corrected from "${info.originalQuery}")`;
                                        } else {
                                            msg += ` for "${info.originalQuery}"`;
                                        }
                                        if (info.intent) {
                                            msg += ` sorted by ${info.intent.toLowerCase().replace('sort: ', '')}`;
                                        }
                                        msg += `. Take a look!`;
                                    } else {
                                        // 0 Results: Don't open panel, just explain
                                        log(`No products found (Stream)`);
                                        msg = `I searched for "${info.correctedQuery || info.originalQuery}"`;
                                        if (info.correctedQuery && info.correctedQuery !== info.originalQuery) {
                                            msg += ` (corrected from "${info.originalQuery}")`;
                                        }
                                        msg += `, but I couldn't find any suitable matches in the marketplace.`;
                                    }

                                    // Add AI Reasoning if available
                                    if (info.reasoning) {
                                        msg += `\n\n🧠 **Thinking:** ${info.reasoning}`;
                                    }

                                    fullText = msg;
                                    setMessages(prev => prev.map(m =>
                                        m.id === assistantId
                                            ? { ...m, content: fullText }
                                            : m
                                    ));
                                } else if (isProductArray(toolOutput)) {
                                    log(`Found ${toolOutput.length} products (Stream Array)`);
                                    setActivePanel('intelligence');
                                    setPanelData({
                                        type: 'intelligence',
                                        products: toolOutput
                                    });

                                    fullText = `I found ${toolOutput.length} products for you! Take a look at the options I've displayed.`;
                                    setMessages(prev => prev.map(m =>
                                        m.id === assistantId
                                            ? { ...m, content: fullText }
                                            : m
                                    ));
                                }
                            }
                        } catch (e) {
                            log(`Parse error for tool result: ${e}`);
                        }
                    }
                    // Finish: d:{...}
                    else if (line.startsWith('d:')) {
                        log('FINISH signal (d:)');
                    }
                }
            }

            // Final update
            const finalMsg: Message = {
                id: assistantId,
                role: 'assistant',
                content: fullText || 'I processed your request.',
                timestamp: new Date(),
                toolInvocations: toolResults.length > 0 ? toolResults as Message['toolInvocations'] : undefined
            };
            setMessages(prev => prev.map(m => m.id === assistantId ? finalMsg : m));
            addMessage(sessionId, finalMsg);

            log(`Complete. Text length: ${fullText.length}, Tools: ${toolResults.length}`);

        } catch (e: unknown) {
            const errMsg = e instanceof Error ? e.message : 'Unknown error';
            log(`ERROR: ${errMsg}`);
            setError(errMsg);
            // Remove placeholder
            setMessages(prev => prev.filter(m => m.id !== assistantId));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full h-full flex flex-col relative">
            <ChatContainer
                messages={messages}
                isLoading={isLoading}
                onSend={handleSend}
            />

            {/* Debug Toggle */}
            <button
                onClick={() => setShowDebug(!showDebug)}
                className="fixed bottom-4 right-4 z-50 px-3 py-2 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg hover:bg-orange-600"
            >
                {showDebug ? 'Hide Debug' : `Debug (${debugLogs.length})`}
            </button>

            {/* Debug Panel */}
            {showDebug && (
                <div className="fixed bottom-16 right-4 w-[420px] max-h-96 overflow-auto bg-black/95 text-green-400 text-[11px] font-mono p-3 rounded-xl shadow-2xl z-50 border border-green-500/30">
                    <div className="flex justify-between items-center mb-2 text-white sticky top-0 bg-black/90 pb-2">
                        <span className="font-bold">Stream Debug</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDebugLogs([])}
                                className="px-2 py-1 bg-red-600 rounded text-xs"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => navigator.clipboard.writeText(debugLogs.join('\n'))}
                                className="px-2 py-1 bg-green-600 rounded text-xs"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                    {debugLogs.length === 0 ? (
                        <div className="text-gray-500">Send a message to see logs...</div>
                    ) : (
                        debugLogs.map((log, i) => (
                            <div key={i} className="border-b border-gray-800 py-1 break-all whitespace-pre-wrap">
                                {log}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Error Toast */}
            {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50">
                    {error}
                    <button onClick={() => setError(null)} className="ml-2 font-bold">✕</button>
                </div>
            )}
        </div>
    );
}
