const fetch = require('node-fetch');

async function test() {
    const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            donorName: 'Test',
            donorEmail: 'test@test.com',
            amount: 100,
            ngoId: 'test-ngo',
            ngoType: 'animal-welfare',
            purpose: 'General',
            userId: 'U123'
        })
    });
    console.log('Status:', res.status);
    console.log('Body:', await res.text());
}
test();
