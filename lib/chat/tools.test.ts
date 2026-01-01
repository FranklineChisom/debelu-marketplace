import { describe, it, expect } from 'vitest';
import { STREAM_PROTOCOL, ToolName, isProductArray } from './tools';

describe('Tool Registry', () => {
    describe('STREAM_PROTOCOL', () => {
        it('should have correct protocol prefixes', () => {
            expect(STREAM_PROTOCOL.TEXT).toBe('0:');
            expect(STREAM_PROTOCOL.TOOL_CALL).toBe('9:');
            expect(STREAM_PROTOCOL.TOOL_RESULT).toBe('a:');
            expect(STREAM_PROTOCOL.FINISH).toBe('d:');
        });
    });

    describe('isProductArray', () => {
        it('should return true for valid product array', () => {
            const products = [
                { id: 'prod_1', name: 'Laptop', price: 50000 },
                { id: 'prod_2', name: 'Phone', price: 30000 }
            ];
            expect(isProductArray(products)).toBe(true);
        });

        it('should return false for empty array', () => {
            expect(isProductArray([])).toBe(false);
        });

        it('should return false for null', () => {
            expect(isProductArray(null)).toBe(false);
        });

        it('should return false for string', () => {
            expect(isProductArray('No products found')).toBe(false);
        });

        it('should return true for array with id and name (price optional)', () => {
            // isProductArray only checks for id and name - price is optional for flexibility
            const products = [
                { id: 'prod_1', name: 'Laptop' },
            ];
            expect(isProductArray(products)).toBe(true);
        });

        it('should return false for array missing id', () => {
            const products = [
                { name: 'Laptop', price: 50000 }, // missing id
            ];
            expect(isProductArray(products)).toBe(false);
        });

        it('should return false for object (non-array)', () => {
            expect(isProductArray({ id: 'prod_1', name: 'Laptop', price: 50000 })).toBe(false);
        });
    });
});

describe('Stream Protocol Parsing', () => {
    it('should identify text content lines', () => {
        const line = '0:"Hello, how can I help you?"';
        expect(line.startsWith(STREAM_PROTOCOL.TEXT)).toBe(true);

        const content = JSON.parse(line.slice(2));
        expect(content).toBe('Hello, how can I help you?');
    });

    it('should identify tool call lines', () => {
        const toolCall = {
            toolCallId: 'call_123',
            toolName: 'search_marketplace',
            args: { query: 'gaming laptop' }
        };
        const line = `9:${JSON.stringify(toolCall)}`;

        expect(line.startsWith(STREAM_PROTOCOL.TOOL_CALL)).toBe(true);

        const parsed = JSON.parse(line.slice(2));
        expect(parsed.toolCallId).toBe('call_123');
        expect(parsed.toolName).toBe('search_marketplace');
        expect(parsed.args.query).toBe('gaming laptop');
    });

    it('should identify tool result lines', () => {
        const toolResult = {
            toolCallId: 'call_123',
            result: [
                { id: 'prod_1', name: 'Gaming Laptop Pro', price: 150000 }
            ]
        };
        const line = `a:${JSON.stringify(toolResult)}`;

        expect(line.startsWith(STREAM_PROTOCOL.TOOL_RESULT)).toBe(true);

        const parsed = JSON.parse(line.slice(2));
        expect(parsed.toolCallId).toBe('call_123');
        expect(isProductArray(parsed.result)).toBe(true);
    });

    it('should identify finish signal lines', () => {
        const finish = { finishReason: 'stop' };
        const line = `d:${JSON.stringify(finish)}`;

        expect(line.startsWith(STREAM_PROTOCOL.FINISH)).toBe(true);
    });

    it('should handle malformed JSON gracefully', () => {
        const malformedLine = '0:{"incomplete json';

        expect(() => {
            JSON.parse(malformedLine.slice(2));
        }).toThrow();
    });
});

describe('ToolName type', () => {
    it('should accept valid tool names', () => {
        const validNames: ToolName[] = [
            'search_marketplace',
            'compare_products',
            'open_ui_panel'
        ];

        expect(validNames.length).toBe(3);
    });
});
