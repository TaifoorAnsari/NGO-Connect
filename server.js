const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ============================================================
//  SCHEMAS
// ============================================================

// RescueReport Schema
const rescueReportSchema = new mongoose.Schema({
    reportId: {
        type: String,
        required: true,
        unique: true,
        default: () => `R${Date.now()}`
    },
    reporterContact: {
        type: String,
        default: null
    },
    reporterUserId: {
        type: String,
        default: null
    },
    animalType: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'cattle', 'other']
    },
    description: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        }
    },
    assignedNGO: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        default: null
    },
    assignedNGOName: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// NGOProfile Schema
const ngoProfileSchema = new mongoose.Schema({
    ngoId: {
        type: String,
        required: true,
        unique: true,
        default: () => `NGO${Date.now()}`
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['animal-welfare', 'elderly-care', 'education', 'healthcare', 'other']
    },
    description: {
        type: String,
        default: ''
    },
    contactNumber: {
        type: String,
        required: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        }
    },
    serviceRadius: {
        type: Number,
        default: 10
    },
    // ---- FAKE NGO DETECTION SYSTEM (AI) ----
    aiTrustScore: {
        type: Number,
        default: 50, // Base starting score
        min: 0,
        max: 100
    },
    verificationStatus: {
        type: String,
        enum: ['verified', 'caution', 'suspicious'],
        default: 'caution'
    },
    ratings: [{
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        score: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    // ------------------------------------------
    // Elderly-care specific fields
    facilities: {
        beds: { type: Number, default: 0 },
        occupiedBeds: { type: Number, default: 0 },
        hasKitchen: { type: Boolean, default: false },
        hasMedicalRoom: { type: Boolean, default: false },
        hasGarden: { type: Boolean, default: false },
        hasLibrary: { type: Boolean, default: false },
        hasRecreation: { type: Boolean, default: false },
        specialCare: { type: String, default: '' }
    },
    // Education specific fields
    programs: [{
        name: String,
        description: String,
        beneficiaries: Number
    }],
    resources: [{
        item: String,
        quantity: Number,
        needed: Boolean
    }],
    volunteers: [{
        name: String,
        contact: String,
        skills: [String]
    }],
    team: [{
        memberId: {
            type: String,
            default: () => `TM${Date.now()}${Math.floor(Math.random() * 1000)}`
        },
        name: String,
        role: String,
        contact: String,
        email: String,
        joinedAt: { type: Date, default: Date.now }
    }],
    stats: {
        rescuesCompleted: {
            type: Number,
            default: 0
        },
        donationsReceived: {
            type: Number,
            default: 0
        },
        volunteersActive: {
            type: Number,
            default: 0
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// User Schema (for Civilians)
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        default: () => `U${Date.now()}`
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    reportsSubmitted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RescueReport'
    }],
    adoptedAnimals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdoptionAnimal'
    }],
    // ---- REWARD SYSTEM ----
    rewardPoints: {
        type: Number,
        default: 0
    },
    rewardLevel: {
        type: String,
        enum: ['None', 'Bronze', 'Silver', 'Gold'],
        default: 'None'
    },
    rewardHistory: [{
        action: { type: String, required: true },
        points: { type: Number, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    certificatesEarned: [{
        milestone: { type: String },
        title: { type: String },
        earnedAt: { type: Date, default: Date.now },
        downloaded: { type: Boolean, default: false }
    }],
    // -----------------------
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Adoption Animal Schema
const adoptionAnimalSchema = new mongoose.Schema({
    animalId: {
        type: String,
        required: true,
        unique: true,
        default: () => `A${Date.now()}`
    },
    name: {
        type: String,
        required: true
    },
    species: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
    },
    breed: {
        type: String,
        default: 'Mixed'
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        default: 'unknown'
    },
    description: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    listedByNGO: {
        type: String,
        required: true
    },
    listedByNGOName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'adopted', 'pending'],
        default: 'available'
    },
    adoptedBy: {
        type: String,
        default: null
    },
    adoptedByName: {
        type: String,
        default: null
    },
    health: {
        type: String,
        default: 'Good'
    },
    vaccinated: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Donation Schema
const donationSchema = new mongoose.Schema({
    donationId: {
        type: String,
        required: true,
        unique: true,
        default: () => `D${Date.now()}`
    },
    donorName: {
        type: String,
        required: true
    },
    donorEmail: {
        type: String,
        required: true
    },
    donorPhone: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        required: true
    },
    ngoId: {
        type: String,
        required: true
    },
    ngoName: {
        type: String,
        default: ''
    },
    ngoType: {
        type: String,
        enum: ['animal-welfare', 'elderly-care', 'education', 'healthcare', 'other'],
        required: true
    },
    purpose: {
        type: String,
        default: 'General'
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'failed'],
        default: 'completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Models
const RescueReport = mongoose.model('RescueReport', rescueReportSchema);
const NGO = mongoose.model('NGO', ngoProfileSchema);
const User = mongoose.model('User', userSchema);
const AdoptionAnimal = mongoose.model('AdoptionAnimal', adoptionAnimalSchema);
const Donation = mongoose.model('Donation', donationSchema);

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'rescue-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// WhatsApp notification helper (Twilio)
async function sendWhatsAppNotification(phone, message) {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

        if (!accountSid || !authToken || accountSid === 'your_twilio_account_sid') {
            console.log('⚠️ Twilio not configured. WhatsApp message would be:', message);
            return { success: false, reason: 'Twilio not configured' };
        }

        const twilio = require('twilio')(accountSid, authToken);

        // Ensure phone has country code
        let toNumber = phone.startsWith('+') ? phone : `+91${phone}`;

        const result = await twilio.messages.create({
            body: message,
            from: fromNumber,
            to: `whatsapp:${toNumber}`
        });

        console.log('✅ WhatsApp message sent:', result.sid);
        return { success: true, sid: result.sid };
    } catch (error) {
        console.error('❌ WhatsApp notification error:', error.message);
        return { success: false, reason: error.message };
    }
}

// ============================================================
//  REWARD SYSTEM HELPERS
// ============================================================

const REWARD_MILESTONES = [
    { points: 100, level: 'Bronze', title: 'Community Helper' },
    { points: 300, level: 'Silver', title: 'Impact Champion' },
    { points: 500, level: 'Gold', title: 'Social Impact Contributor' }
];

const REWARD_POINTS = {
    'report_animal': 25,
    'donate': 50,
    'adopt_animal': 75,
    'volunteer': 40
};

async function awardPoints(userId, action, description) {
    try {
        const points = REWARD_POINTS[action];
        if (!points) return null;

        const user = await User.findOne({ userId });
        if (!user) return null;

        const oldPoints = user.rewardPoints || 0;
        const newPoints = oldPoints + points;

        // Add to history
        user.rewardHistory.push({
            action,
            points,
            description: description || action.replace(/_/g, ' ')
        });

        user.rewardPoints = newPoints;

        // Check milestones
        let newMilestone = null;
        for (const milestone of REWARD_MILESTONES) {
            if (oldPoints < milestone.points && newPoints >= milestone.points) {
                // User just crossed this milestone
                user.rewardLevel = milestone.level;
                newMilestone = milestone;

                // Add certificate record if not already earned
                const alreadyEarned = user.certificatesEarned.some(c => c.milestone === milestone.level);
                if (!alreadyEarned) {
                    user.certificatesEarned.push({
                        milestone: milestone.level,
                        title: milestone.title
                    });
                }
            }
        }

        // Also set level based on current points (in case points were added out of order)
        if (newPoints >= 500) user.rewardLevel = 'Gold';
        else if (newPoints >= 300) user.rewardLevel = 'Silver';
        else if (newPoints >= 100) user.rewardLevel = 'Bronze';
        else user.rewardLevel = 'None';

        await user.save();

        return {
            pointsAwarded: points,
            totalPoints: newPoints,
            level: user.rewardLevel,
            newMilestone: newMilestone
        };
    } catch (error) {
        console.error('Error awarding points:', error);
        return null;
    }
}

// ============================================================
//  API ROUTES
// ============================================================

// ============ USER AUTH ============

// User Registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = new User({ name, email, password, phone });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// User Login
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get user profile
app.get('/api/users/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Get reports by user
app.get('/api/users/:userId/reports', async (req, res) => {
    try {
        const reports = await RescueReport.find({ reporterUserId: req.params.userId })
            .sort({ createdAt: -1 });

        res.json({ success: true, reports });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// ============ RESCUE REPORTS ============

// Submit Rescue Report
app.post('/api/reports', upload.single('photo'), async (req, res) => {
    try {
        const { description, animalType, contact, latitude, longitude, location, userId } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Photo is required' });
        }

        const report = new RescueReport({
            description,
            animalType,
            reporterContact: contact,
            reporterUserId: userId || null,
            photoUrl: `/uploads/${req.file.filename}`,
            location: {
                address: location,
                coordinates: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                }
            }
        });

        await report.save();

        const nearbyNGOs = await findNearbyNGOs(
            parseFloat(latitude),
            parseFloat(longitude),
            'animal-welfare'
        );

        console.log(`📢 Notifying ${nearbyNGOs.length} nearby NGOs about rescue report ${report.reportId}`);

        // Award reward points for reporting
        let rewardResult = null;
        if (userId) {
            rewardResult = await awardPoints(userId, 'report_animal', `Reported injured ${animalType}`);
        }

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            report: {
                reportId: report.reportId,
                status: report.status,
                createdAt: report.createdAt
            },
            notifiedNGOs: nearbyNGOs.length,
            reward: rewardResult
        });

    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// Get all reports (for NGO dashboard)
app.get('/api/reports', async (req, res) => {
    try {
        const { status, ngoId, latitude, longitude, radius } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (ngoId) {
            query.assignedNGO = ngoId;
        }

        let reports = await RescueReport.find(query)
            .populate('assignedNGO', 'name contactNumber')
            .sort({ createdAt: -1 });

        if (latitude && longitude && radius) {
            reports = reports.filter(report => {
                const distance = calculateDistance(
                    parseFloat(latitude),
                    parseFloat(longitude),
                    report.location.coordinates.latitude,
                    report.location.coordinates.longitude
                );
                return distance <= parseFloat(radius);
            });
        }

        res.json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Get single report
app.get('/api/reports/:reportId', async (req, res) => {
    try {
        const report = await RescueReport.findOne({ reportId: req.params.reportId });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json({ success: true, report });

    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

// Accept/Assign rescue task to NGO (+ WhatsApp notification)
app.post('/api/reports/:reportId/assign', async (req, res) => {
    try {
        const { ngoId } = req.body;

        console.log("Received NGO ID:", ngoId);

        const report = await RescueReport.findOne({ reportId: req.params.reportId });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        if (report.status !== 'pending') {
            return res.status(400).json({ error: 'Report already assigned' });
        }

        const ngo = await NGO.findOne({ ngoId });

        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        report.assignedNGO = ngo._id;
        report.assignedNGOName = ngo.name;
        report.status = 'assigned';
        report.updatedAt = new Date();

        await report.save();

        // Send WhatsApp notification to reporter
        if (report.reporterContact) {
            const whatsappMessage = `🚨 *NGO-Connect Update*\n\nYour rescue report (ID: ${report.reportId}) has been *accepted* by *${ngo.name}*!\n\n📞 NGO Contact: ${ngo.contactNumber}\n📍 They are on their way!\n\nTrack your report at: http://localhost:5000/dashboard-user.html\n\nThank you for helping save a life! 🐾`;

            const whatsappResult = await sendWhatsAppNotification(report.reporterContact, whatsappMessage);
            console.log('WhatsApp notification result:', whatsappResult);
        }

        // Also try to notify user by userId if available
        if (report.reporterUserId) {
            const reporterUser = await User.findOne({ userId: report.reporterUserId });
            if (reporterUser && reporterUser.phone) {
                const whatsappMessage = `🚨 *NGO-Connect Update*\n\nHi ${reporterUser.name}! Your rescue report (ID: ${report.reportId}) has been *accepted* by *${ngo.name}*!\n\n📞 NGO Contact: ${ngo.contactNumber}\n📍 They are on their way!\n\nTrack your report at: http://localhost:5000/dashboard-user.html\n\nThank you for helping save a life! 🐾`;

                const whatsappResult = await sendWhatsAppNotification(reporterUser.phone, whatsappMessage);
                console.log('WhatsApp notification to user result:', whatsappResult);
            }
        }

        res.json({
            success: true,
            message: 'Rescue task accepted',
            report
        });

    } catch (error) {
        console.error('Error assigning report:', error);
        res.status(500).json({ error: 'Failed to assign report' });
    }
});

// Update report status
app.patch('/api/reports/:reportId/status', async (req, res) => {
    try {
        const { status } = req.body;

        const report = await RescueReport.findOne({ reportId: req.params.reportId });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        report.status = status;
        report.updatedAt = new Date();

        await report.save();

        if (status === 'completed' && report.assignedNGO) {
            await NGO.findByIdAndUpdate(report.assignedNGO, {
                $inc: { 'stats.rescuesCompleted': 1 }
            });
        }

        res.json({
            success: true,
            message: 'Report status updated',
            report
        });

    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ error: 'Failed to update report status' });
    }
});

// ============ NGO MANAGEMENT ============

// Register NGO
app.post('/api/ngos/register', async (req, res) => {
    try {
        const {
            name, email, password, type, contactNumber,
            address, latitude, longitude, description
        } = req.body;

        const existingNGO = await NGO.findOne({ email });
        if (existingNGO) {
            return res.status(400).json({ error: 'NGO with this email already exists' });
        }

        const ngo = new NGO({
            name, email, password, type, contactNumber, description,
            location: {
                address,
                coordinates: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                }
            }
        });

        await ngo.save();

        res.status(201).json({
            success: true,
            message: 'NGO registered successfully',
            ngo: {
                ngoId: ngo.ngoId,
                name: ngo.name,
                type: ngo.type
            }
        });

    } catch (error) {
        console.error('Error registering NGO:', error);
        res.status(500).json({ error: 'Failed to register NGO' });
    }
});

// NGO Login
app.post('/api/ngos/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const ngo = await NGO.findOne({ email });
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        if (ngo.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.json({
            success: true,
            message: 'Login successful',
            ngo: {
                ngoId: ngo.ngoId,
                name: ngo.name,
                type: ngo.type
            }
        });

    } catch (error) {
        console.error('NGO login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get NGO profile
app.get('/api/ngos/:ngoId', async (req, res) => {
    try {
        const ngo = await NGO.findOne({ ngoId: req.params.ngoId }).select('-password');
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        res.json({ success: true, ngo });

    } catch (error) {
        console.error('Error fetching NGO:', error);
        res.status(500).json({ error: 'Failed to fetch NGO' });
    }
});

// Update NGO settings
app.patch('/api/ngos/:ngoId/settings', async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Don't allow password change via this endpoint
        delete updates.ngoId;

        const ngo = await NGO.findOneAndUpdate(
            { ngoId: req.params.ngoId },
            { $set: updates },
            { new: true }
        ).select('-password');

        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        res.json({ success: true, message: 'Settings updated', ngo });

    } catch (error) {
        console.error('Error updating NGO settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Get all NGOs by type
app.get('/api/ngos', async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type) query.type = type;

        const ngos = await NGO.find(query).select('-password');

        res.json({ success: true, count: ngos.length, ngos });

    } catch (error) {
        console.error('Error fetching NGOs:', error);
        res.status(500).json({ error: 'Failed to fetch NGOs' });
    }
});

// ============ NGO TEAM ============

// Add team member
app.post('/api/ngos/:ngoId/team', async (req, res) => {
    try {
        const { name, role, contact, email } = req.body;

        const ngo = await NGO.findOne({ ngoId: req.params.ngoId });
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        const newMember = {
            memberId: `TM${Date.now()}${Math.floor(Math.random() * 1000)}`,
            name, role, contact, email
        };

        ngo.team.push(newMember);
        await ngo.save();

        res.status(201).json({ success: true, message: 'Team member added', member: newMember });

    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).json({ error: 'Failed to add team member' });
    }
});

// Get team members
app.get('/api/ngos/:ngoId/team', async (req, res) => {
    try {
        const ngo = await NGO.findOne({ ngoId: req.params.ngoId });
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        res.json({ success: true, team: ngo.team });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch team' });
    }
});

// Remove team member
app.delete('/api/ngos/:ngoId/team/:memberId', async (req, res) => {
    try {
        const ngo = await NGO.findOne({ ngoId: req.params.ngoId });
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        ngo.team = ngo.team.filter(m => m.memberId !== req.params.memberId);
        await ngo.save();

        res.json({ success: true, message: 'Team member removed' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to remove team member' });
    }
});

// ============ ADOPTION ============

// List animal for adoption (NGO)
app.post('/api/adoptions', upload.single('photo'), async (req, res) => {
    try {
        const { name, species, breed, age, gender, description, ngoId, health, vaccinated } = req.body;

        const ngo = await NGO.findOne({ ngoId });
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        const animal = new AdoptionAnimal({
            name, species, breed, age, gender, description,
            photoUrl: req.file ? `/uploads/${req.file.filename}` : '/uploads/default-pet.png',
            listedByNGO: ngoId,
            listedByNGOName: ngo.name,
            health: health || 'Good',
            vaccinated: vaccinated === 'true' || vaccinated === true
        });

        await animal.save();

        res.status(201).json({
            success: true,
            message: 'Animal listed for adoption',
            animal
        });

    } catch (error) {
        console.error('Error listing animal:', error);
        res.status(500).json({ error: 'Failed to list animal' });
    }
});

// Get all available animals for adoption
app.get('/api/adoptions', async (req, res) => {
    try {
        const { species, ngoId, status } = req.query;
        let query = {};

        if (species) query.species = species;
        if (ngoId) query.listedByNGO = ngoId;
        if (status) {
            query.status = status;
        } else {
            query.status = 'available';
        }

        const animals = await AdoptionAnimal.find(query).sort({ createdAt: -1 });

        res.json({ success: true, count: animals.length, animals });

    } catch (error) {
        console.error('Error fetching animals:', error);
        res.status(500).json({ error: 'Failed to fetch animals' });
    }
});

// Adopt an animal
app.post('/api/adoptions/:animalId/adopt', async (req, res) => {
    try {
        const { userId, userName } = req.body;

        const animal = await AdoptionAnimal.findOne({ animalId: req.params.animalId });
        if (!animal) {
            return res.status(404).json({ error: 'Animal not found' });
        }

        if (animal.status !== 'available') {
            return res.status(400).json({ error: 'Animal is not available for adoption' });
        }

        animal.status = 'adopted';
        animal.adoptedBy = userId;
        animal.adoptedByName = userName;
        await animal.save();

        // Add to user's adopted animals
        if (userId) {
            await User.findOneAndUpdate(
                { userId },
                { $push: { adoptedAnimals: animal._id } }
            );
        }

        // Award reward points for adoption
        let rewardResult = null;
        if (userId) {
            rewardResult = await awardPoints(userId, 'adopt_animal', `Adopted ${animal.name}`);
        }

        res.json({
            success: true,
            message: `${animal.name} has been adopted!`,
            animal,
            reward: rewardResult
        });

    } catch (error) {
        console.error('Error processing adoption:', error);
        res.status(500).json({ error: 'Failed to process adoption' });
    }
});

// Delete adoption animal listing
app.delete('/api/adoptions/:animalId', async (req, res) => {
    try {
        const animal = await AdoptionAnimal.findOneAndDelete({ animalId: req.params.animalId });
        if (!animal) {
            return res.status(404).json({ error: 'Animal not found' });
        }

        res.json({ success: true, message: 'Animal listing removed' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to remove animal listing' });
    }
});

// ============ DONATIONS ============

// Make a donation
app.post('/api/donations', async (req, res) => {
    try {
        const { donorName, donorEmail, donorPhone, amount, ngoId, ngoType, purpose, message } = req.body;

        const ngo = await NGO.findOne({ ngoId });
        const ngoName = ngo ? ngo.name : 'Unknown NGO';

        const donation = new Donation({
            donorName, donorEmail, donorPhone, amount,
            ngoId, ngoName, ngoType,
            purpose: purpose || 'General',
            message: message || ''
        });

        await donation.save();

        // Update NGO donation stats safely without full validation trigger
        if (ngo) {
            await NGO.findOneAndUpdate(
                { ngoId: ngo.ngoId },
                { $inc: { 'stats.donationsReceived': amount } },
                { new: true, setDefaultsOnInsert: true }
            );
        }

        // Generate Receipt PDF
        const doc = new PDFDocument();
        const receiptFileName = `receipt-${donation.donationId}.pdf`;
        const receiptPath = path.join(__dirname, 'uploads', receiptFileName);
        const writeStream = fs.createWriteStream(receiptPath);
        
        doc.pipe(writeStream);
        
        doc.fontSize(24).fillColor('#D94A2B').text('NGO-Connect', { align: 'center' });
        doc.fontSize(16).fillColor('#2D3142').text('Donation Receipt', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12).fillColor('#2D3142');
        doc.text(`Receipt No: ${donation.donationId}`);
        doc.text(`Date: ${donation.createdAt.toLocaleDateString()}`);
        doc.moveDown();
        doc.text(`Donor Name: ${donation.donorName}`);
        doc.text(`Donor Email: ${donation.donorEmail}`);
        doc.text(`NGO Supported: ${ngoName}`);
        doc.text(`Cause: ${ngoType}`);
        doc.moveDown();
        
        doc.fontSize(14).fillColor('#000000').text(`Amount Donated: Rs. ${donation.amount}`, { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#2D3142').text(`Purpose: ${donation.purpose}`);
        
        doc.moveDown(2);
        doc.fontSize(14).fillColor('#4ECDC4').text('Thank you for your generous contribution!', { align: 'center' });
        
        doc.end();

        // Award reward points for donation
        let rewardResult = null;
        const donorUserId = req.body.userId;
        if (donorUserId) {
            rewardResult = await awardPoints(donorUserId, 'donate', `Donated Rs.${amount} to ${ngoName}`);
        }

        writeStream.on('finish', () => {
            res.status(201).json({
                success: true,
                message: 'Donation recorded',
                donation: {
                    donationId: donation.donationId,
                    amount: donation.amount,
                    ngoName
                },
                receiptUrl: `/uploads/${receiptFileName}`,
                reward: rewardResult
            });
        });

        writeStream.on('error', (err) => {
            console.error('PDF error:', err);
            res.status(500).json({ error: 'Failed to generate receipt PDF' });
        });

    } catch (error) {
        console.error('Error recording donation:', error);
        res.status(500).json({ error: error.message || 'Failed to record donation' });
    }
});

// Get donations for an NGO
app.get('/api/donations', async (req, res) => {
    try {
        const { ngoId, ngoType } = req.query;
        let query = {};
        if (ngoId) query.ngoId = ngoId;
        if (ngoType) query.ngoType = ngoType;

        const donations = await Donation.find(query).sort({ createdAt: -1 });

        res.json({ success: true, count: donations.length, donations });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
});

// ============ HELPERS ============

// Find nearby NGOs
async function findNearbyNGOs(latitude, longitude, type) {
    try {
        const allNGOs = await NGO.find({ type });

        const nearbyNGOs = allNGOs.filter(ngo => {
            const distance = calculateDistance(
                latitude, longitude,
                ngo.location.coordinates.latitude,
                ngo.location.coordinates.longitude
            );
            return distance <= ngo.serviceRadius;
        });

        return nearbyNGOs;

    } catch (error) {
        console.error('Error finding nearby NGOs:', error);
        return [];
    }
}

// Get nearby NGOs (public endpoint)
app.get('/api/ngos/nearby', async (req, res) => {
    try {
        const { latitude, longitude, type } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const nearbyNGOs = await findNearbyNGOs(
            parseFloat(latitude),
            parseFloat(longitude),
            type || 'animal-welfare'
        );

        res.json({
            success: true,
            count: nearbyNGOs.length,
            ngos: nearbyNGOs
        });

    } catch (error) {
        console.error('Error fetching nearby NGOs:', error);
        res.status(500).json({ error: 'Failed to fetch nearby NGOs' });
    }
});

// ============ FAKE NGO DETECTION SYSTEM (AI) ============

// Helper to calculate AI Trust Score
function calculateAITrustScore(ngo) {
    let score = 50; // Base score

    // Signal 1: Completed Rescues / Handled Cases
    if (ngo.stats && ngo.stats.rescuesCompleted) {
        score += Math.min(ngo.stats.rescuesCompleted * 2, 20); // Max +20 from rescues
    }

    // Signal 2: Profile Completeness
    if (ngo.description && ngo.description.length > 20) score += 5;
    if (ngo.location && ngo.location.address) score += 5;

    // Signal 3: Community Ratings
    if (ngo.ratings && ngo.ratings.length > 0) {
        const avgRating = ngo.ratings.reduce((sum, r) => sum + r.score, 0) / ngo.ratings.length;
        // Map 1-5 scale to -15 to +20 points
        if (avgRating >= 4.5) score += 20;
        else if (avgRating >= 4.0) score += 10;
        else if (avgRating >= 3.0) score += 0;
        else if (avgRating >= 2.0) score -= 10;
        else score -= 20;
    }

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine Status
    let status = 'caution';
    if (score >= 80) status = 'verified';
    else if (score < 50) status = 'suspicious';

    return { score, status };
}

// Rate an NGO
app.post('/api/ngos/:ngoId/rate', async (req, res) => {
    try {
        const { userId, userName, score, review } = req.body;
        
        let ngo;
        if (mongoose.isValidObjectId(req.params.ngoId)) {
            ngo = await NGO.findById(req.params.ngoId);
        }
        if (!ngo) {
            ngo = await NGO.findOne({ ngoId: req.params.ngoId });
        }

        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        // Add the new rating
        ngo.ratings.push({ userId, userName, score: Number(score), review });

        // Recalculate AI Trust Score
        const aiAssessment = calculateAITrustScore(ngo);
        ngo.aiTrustScore = aiAssessment.score;
        ngo.verificationStatus = aiAssessment.status;

        await ngo.save();

        res.json({
            success: true,
            message: 'Rating submitted successfully',
            aiTrustScore: ngo.aiTrustScore,
            verificationStatus: ngo.verificationStatus
        });

    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
});

// Trigger an AI Verification refresh for all or single NGO
app.post('/api/ngos/:ngoId/verify', async (req, res) => {
    try {
        let ngo;
        if (mongoose.isValidObjectId(req.params.ngoId)) {
            ngo = await NGO.findById(req.params.ngoId);
        }
        if (!ngo) {
            ngo = await NGO.findOne({ ngoId: req.params.ngoId });
        }

        if (!ngo) return res.status(404).json({ error: 'NGO not found' });

        const aiAssessment = calculateAITrustScore(ngo);
        ngo.aiTrustScore = aiAssessment.score;
        ngo.verificationStatus = aiAssessment.status;

        await ngo.save();
        res.json({ success: true, aiTrustScore: ngo.aiTrustScore, verificationStatus: ngo.verificationStatus });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify NGO' });
    }
});

// ============================================================

// ============ REWARD SYSTEM API ============

// Get user rewards / points
app.get('/api/users/:userId/rewards', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId }).select('rewardPoints rewardLevel rewardHistory certificatesEarned name');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Calculate next milestone
        let nextMilestone = null;
        for (const ms of REWARD_MILESTONES) {
            if (user.rewardPoints < ms.points) {
                nextMilestone = {
                    level: ms.level,
                    pointsNeeded: ms.points - user.rewardPoints,
                    totalNeeded: ms.points
                };
                break;
            }
        }

        res.json({
            success: true,
            rewards: {
                totalPoints: user.rewardPoints || 0,
                level: user.rewardLevel || 'None',
                history: (user.rewardHistory || []).slice().reverse(),
                certificates: user.certificatesEarned || [],
                nextMilestone,
                milestones: REWARD_MILESTONES
            }
        });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Failed to fetch rewards' });
    }
});

// Generate / Download certificate PDF
app.get('/api/users/:userId/certificate/:milestone', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const milestone = req.params.milestone;
        const milestoneInfo = REWARD_MILESTONES.find(m => m.level === milestone);
        if (!milestoneInfo) {
            return res.status(400).json({ error: 'Invalid milestone' });
        }

        if (user.rewardPoints < milestoneInfo.points) {
            return res.status(403).json({ error: 'Milestone not yet reached' });
        }

        const certRecord = user.certificatesEarned.find(c => c.milestone === milestone);
        const earnedDate = certRecord ? certRecord.earnedAt : new Date();

        // Generate Certificate PDF
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margins: { top: 50, bottom: 50, left: 60, right: 60 }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate-${milestone.toLowerCase()}-${user.userId}.pdf`);

        doc.pipe(res);

        // -- Certificate Design --
        // Border
        const badgeColors = { Bronze: '#CD7F32', Silver: '#C0C0C0', Gold: '#FFD700' };
        const accentColor = badgeColors[milestone] || '#D94A2B';

        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
           .lineWidth(3)
           .strokeColor(accentColor)
           .stroke();

        doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
           .lineWidth(1)
           .strokeColor('#E5E7EB')
           .stroke();

        // Header
        doc.moveDown(2);
        doc.fontSize(14).fillColor('#9CA3AF').text('NGO-CONNECT', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(36).fillColor('#2D3142').text('Certificate of Achievement', { align: 'center' });
        doc.moveDown(0.3);

        // Decorative line
        const centerX = doc.page.width / 2;
        doc.moveTo(centerX - 100, doc.y).lineTo(centerX + 100, doc.y)
           .lineWidth(2).strokeColor(accentColor).stroke();

        doc.moveDown(1.5);
        doc.fontSize(14).fillColor('#6B7280').text('This certificate is proudly presented to', { align: 'center' });
        doc.moveDown(0.8);
        doc.fontSize(30).fillColor(accentColor).text(user.name, { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#6B7280').text('In recognition of achieving the', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(24).fillColor('#2D3142').text(`${milestone} Badge - ${milestoneInfo.title}`, { align: 'center' });
        doc.moveDown(0.8);
        doc.fontSize(12).fillColor('#9CA3AF').text(`With ${milestoneInfo.points}+ reward points earned through acts of compassion and service`, { align: 'center' });
        doc.moveDown(1.5);

        // Date
        const dateStr = new Date(earnedDate).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        doc.fontSize(12).fillColor('#6B7280').text(`Awarded on: ${dateStr}`, { align: 'center' });

        doc.moveDown(2);
        doc.fontSize(10).fillColor('#D1D5DB').text('Verified by NGO-Connect Platform', { align: 'center' });

        doc.end();

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Failed to generate certificate' });
    }
});

// ============================================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'NGO-Connect API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;