const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ngo-connect';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas and Models

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
        default: 10 // in kilometers
    },
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Models
const RescueReport = mongoose.model('RescueReport', rescueReportSchema);
const NGO = mongoose.model('NGO', ngoProfileSchema);
const User = mongoose.model('User', userSchema);

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
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

// API Routes

// Submit Rescue Report
app.post('/api/reports', upload.single('photo'), async (req, res) => {
    try {
        const { description, animalType, contact, latitude, longitude, location } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Photo is required' });
        }

        // Create rescue report
        const report = new RescueReport({
            description,
            animalType,
            reporterContact: contact,
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

        // Find nearby animal welfare NGOs
        const nearbyNGOs = await findNearbyNGOs(
            parseFloat(latitude),
            parseFloat(longitude),
            'animal-welfare'
        );

        // In production, send notifications to nearby NGOs via WebSocket/Push Notifications
        console.log(`📢 Notifying ${nearbyNGOs.length} nearby NGOs about rescue report ${report.reportId}`);

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            report: {
                reportId: report.reportId,
                status: report.status,
                createdAt: report.createdAt
            },
            notifiedNGOs: nearbyNGOs.length
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

        // Filter by location if provided
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

        res.json({
            success: true,
            report
        });

    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

// Accept/Assign rescue task to NGO
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

        // Update NGO stats if completed
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

// Register NGO
app.post('/api/ngos/register', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            type,
            contactNumber,
            address,
            latitude,
            longitude,
            description
        } = req.body;

        // Check if NGO already exists
        const existingNGO = await NGO.findOne({ email });

        if (existingNGO) {
            return res.status(400).json({ error: 'NGO with this email already exists' });
        }

        // Create new NGO
        const ngo = new NGO({
            name,
            email,
            password, // In production, hash this password!
            type,
            contactNumber,
            description,
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

        // simple password check (no hashing for now)
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

        res.json({
            success: true,
            ngo
        });

    } catch (error) {
        console.error('Error fetching NGO:', error);
        res.status(500).json({ error: 'Failed to fetch NGO' });
    }
});

// Helper function to find nearby NGOs
async function findNearbyNGOs(latitude, longitude, type) {
    try {
        const allNGOs = await NGO.find({ type });

        const nearbyNGOs = allNGOs.filter(ngo => {
            const distance = calculateDistance(
                latitude,
                longitude,
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
        const { latitude, longitude, type, radius = 10 } = req.query;

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