const ai = require('ai');
console.log('Available exports in "ai":', Object.keys(ai));
try {
    console.log('convertToCoreMessages:', typeof ai.convertToCoreMessages);
} catch (e) {
    console.log('convertToCoreMessages error:', e.message);
}
try {
    console.log('convertToModelMessages:', typeof ai.convertToModelMessages);
} catch (e) {
    console.log('convertToModelMessages error:', e.message);
}
