require('dotenv').config();

async function testWhatsapp() {
    console.log('Testing WhatsApp with credentials from .env...');
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    console.log(`SID: ${accountSid?.substring(0,6)}...`);
    console.log(`From: ${fromNumber}`);

    if (!accountSid || accountSid.includes('your_')) {
         console.log('⚠️ Credentials still have placeholder values!');
         return;
    }

    try {
        const twilio = require('twilio')(accountSid, authToken);
        const result = await twilio.messages.create({
            body: 'Hello from NGO-Connect Test! 🐾',
            from: fromNumber,
            // Replace this with the user's number or just let it fail on sandbox
            to: `whatsapp:+919876543210` // dummy number for syntax check
        });
        console.log('✅ Success! Message SID:', result.sid);
    } catch (e) {
        console.error('❌ Twilio Error:', e.message);
        if (e.code) console.error('Error Code:', e.code);
    }
}

testWhatsapp();
