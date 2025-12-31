const { convertToModelMessages } = require('ai');

const mockMessages = [
    { role: 'user', content: 'Hello', id: '1' },
    { role: 'assistant', content: 'Hi there', id: '2' }
];

console.log('Input:', mockMessages);

try {
    const result = convertToModelMessages(mockMessages);
    console.log('Is Promise?', result instanceof Promise);

    if (result instanceof Promise) {
        result.then(res => {
            console.log('Resolved Result:', JSON.stringify(res, null, 2));
        }).catch(err => {
            console.error('Promise Error:', err);
        });
    } else {
        console.log('Result:', JSON.stringify(result, null, 2));
    }
} catch (e) {
    console.error('Sync Error:', e);
}
