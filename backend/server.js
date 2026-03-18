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
const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://sekar-industries-frontend.onrender.com',
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

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.set('trust proxy', 1);

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
            return res.sendStatus(204);
        }

        console.warn(`CORS blocked for origin: ${origin}`);
        return res.status(403).json({ success: false, message: 'CORS blocked' });
    }

    return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    }
}));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/adminDashboard', adminDashboardRoutes); 
app.use('/api/requests', productRequestsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/business', businessRoutes);

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sekar Industries API is running',
        timestamp: new Date().toISOString()
    });
});

app.use((err, req, res, next) => {
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