const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://mohammadmursaleen00:mursaleen@cluster0.hbe7l.mongodb.net/ngo-connect?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const NGO = mongoose.model('NGO', new mongoose.Schema({ ngoId: String, name: String, ngoType: String, stats: Object }));
        
        const ngos = await NGO.find({ ngoType: { $in: ['elderly-care', 'education'] } });
        console.log('--- NGOS FOUND ---');
        ngos.forEach(n => {
            console.log(`Name: ${n.name}, ngoId: ${n.ngoId}, type: ${n.ngoType}, stats: ${JSON.stringify(n.stats)}`);
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
check();
