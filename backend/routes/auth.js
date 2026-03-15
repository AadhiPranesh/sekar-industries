import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const adminLoginAttempts = new Map();
const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const ADMIN_LOGIN_MAX_ATTEMPTS = 5;

const adminLoginRateLimit = (req, res, next) => {
    const key = `${req.ip}:admin-login`;
    const now = Date.now();
    const current = adminLoginAttempts.get(key) || { count: 0, firstAttemptAt: now };

    if (now - current.firstAttemptAt > ADMIN_LOGIN_WINDOW_MS) {
        adminLoginAttempts.set(key, { count: 1, firstAttemptAt: now });
        return next();
    }

    if (current.count >= ADMIN_LOGIN_MAX_ATTEMPTS) {
        return res.status(429).json({
            success: false,
            message: 'Too many login attempts. Please try again later.'
        });
    }

    current.count += 1;
    adminLoginAttempts.set(key, current);
    return next();
};

const clearAdminLoginRateLimit = (req) => {
    const key = `${req.ip}:admin-login`;
    adminLoginAttempts.delete(key);
};

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            phone,
            password
        });

        await user.save();

        // Set session
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating account. Please try again.'
        });
    }
});

// User login route (session-based)
router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const normalizedPassword = String(password || '').trim();

        // Validate required fields
        if (!normalizedEmail || !normalizedPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(normalizedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Set session
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in. Please try again.'
        });
    }
});

// Admin login route (JWT-based)
router.post('/login', adminLoginRateLimit, async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const normalizedPassword = String(password || '').trim();

        if (!normalizedEmail || !normalizedPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const admin = await Admin.findOne({ email: normalizedEmail });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await admin.comparePassword(normalizedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        clearAdminLoginRateLimit(req);

        return res.json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error logging in. Please try again.'
        });
    }
});

router.get('/verify-admin', verifyToken, (req, res) => {
    return res.json({
        success: true,
        admin: req.admin
    });
});

// Forgot password — generate OTP and store on user document
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ success: false, message: 'Valid email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // Always respond with success to avoid revealing whether an email exists
        if (!user) {
            return res.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = expires;
        await user.save();

        // Log OTP to server console (no email service configured)
        console.log(`[PASSWORD RESET] OTP for ${user.email}: ${otp} (expires in 10 min)`);

        return res.json({
            success: true,
            message: 'OTP has been sent to your email.',
            ...(process.env.NODE_ENV !== 'production' && { dev_otp: otp })
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ success: false, message: 'Error processing request. Please try again.' });
    }
});

// Reset password — verify OTP and update password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please request a new one.' });
        }

        user.password = password;
        user.resetPasswordOtp = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.json({ success: true, message: 'Password reset successfully. You can now login.' });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ success: false, message: 'Error resetting password. Please try again.' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error logging out'
            });
        }
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
});

// Get current user
router.get('/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    res.json({
        success: true,
        user: req.session.user
    });
});

export default router;
