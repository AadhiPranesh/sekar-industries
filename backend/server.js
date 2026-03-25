import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import adminDashboardRoutes from './routes/adminDashboard.js'; 
import productRequestsRoutes from './routes/productRequests.js';
import salesRoutes from './routes/sales.js';
import reviewsRoutes from './routes/reviews.js';
import contactRoutes from './routes/contact.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import businessRoutes from './routes/business.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'dev-only-session-secret-change-me';
const mongoDbName = process.env.MONGODB_DB_NAME || 'sekar-industries';
const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',

    'https://sekar-industries-3.onrender.com',
    process.env.FRONTEND_URL
].filter(Boolean));

const renderOriginPattern = /^https:\/\/sekar-industries(?:-[a-z0-9]+)?\.onrender\.com$/i;

const isOriginAllowed = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.has(origin)) return true;
    if (renderOriginPattern.test(origin)) return true;
    return false;
};

if (!process.env.SESSION_SECRET) {
    console.warn('SESSION_SECRET is not set; using a fallback secret. Set SESSION_SECRET in production.');
}

if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set! Database operations will fail. Set MONGODB_URI in your environment variables.');
}

console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Missing');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Missing');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.set('trust proxy', 1);

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`📨 [${timestamp}] ${req.method} ${req.path}`);
    
    // Log request body for POST/PATCH requests (hide passwords)
    if ((req.method === 'POST' || req.method === 'PATCH') && req.body) {
        const safeBody = { ...req.body };
        if (safeBody.password) safeBody.password = '***';
        console.log(`   Body:`, JSON.stringify(safeBody).substring(0, 200));
    }
    
    next();
});

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && isOriginAllowed(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    if (req.method === 'OPTIONS') {
        if (!origin || isOriginAllowed(origin)) {
            console.log(`✅ CORS preflight allowed for: ${origin}`);
            return res.sendStatus(204);
        }

        res.header('Vary', 'Origin');
        console.warn(`❌ CORS blocked for origin: ${origin}`);
        return res.status(403).json({ success: false, message: 'CORS blocked' });
    }

    return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    }
}));

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, { dbName: mongoDbName })
        .then(() => console.log(`✅ MongoDB connected successfully (db: ${mongoose.connection.db?.databaseName || mongoDbName})`))
        .catch(err => console.error('❌ MongoDB connection error:', err.message));
} else {
    console.warn('⚠️  No MONGODB_URI set. Database features will not work.');
}

app.use('/api/auth', authRoutes);
app.use('/api/adminDashboard', adminDashboardRoutes); 
app.use('/api/requests', productRequestsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/business', businessRoutes);

app.get('/test', (req, res) => {
    console.log('✅ /test endpoint hit - Backend is responsive');
    res.status(200).json({ 
        message: 'Backend working',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/health', (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    
    console.log(`🏥 Health check: DB=${dbConnected ? 'OK' : 'FAILED'}`);
    
    res.json({ 
        status: dbConnected ? 'OK' : 'DEGRADED',
        message: 'Sekar Industries API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: {
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
        },
        database: {
            connected: dbConnected,
            state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
            uri: process.env.MONGODB_URI ? '✓ Set' : '✗ Not set',
            dbName: mongoose.connection.db?.databaseName || mongoDbName
        },
        env: {
            nodeEnv: process.env.NODE_ENV || 'not set',
            sessionSecret: process.env.SESSION_SECRET ? '✓ Set' : '✗ Not set',
            frontendUrl: process.env.FRONTEND_URL ? '✓ Set' : '✗ Not set'
        }
    });
});

app.use((err, req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isOriginAllowed(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
    }

    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});