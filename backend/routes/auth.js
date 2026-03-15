import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
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

const hasEmailConfig = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
const getEmailPassword = () => String(process.env.EMAIL_PASS || '').replace(/\s+/g, '');

const createMailer = () => {
    if (!hasEmailConfig()) {
        return null;
    }

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: getEmailPassword()
        }
    });
};

const sendResetOtpEmail = async (recipientEmail, otp) => {
    try {
        const transporter = createMailer();

        if (!transporter) {
            return {
                sent: false,
                reason: 'Email credentials are missing in environment variables.'
            };
        }

        const sender = process.env.EMAIL_FROM || process.env.EMAIL_USER;

        await transporter.sendMail({
            from: sender,
            to: recipientEmail,
            subject: 'Sekar Industries Password Reset OTP',
            text: [
                'Your password reset OTP is below:',
                '',
                `OTP: ${otp}`,
                '',
                'This OTP will expire in 10 minutes.',
                'Do not share this code with anyone.'
            ].join('\n'),
            html: `
                <div style="margin: 0; padding: 24px; background-color: #F7F6F2; font-family: Inter, Segoe UI, Arial, sans-serif; color: #333333; line-height: 1.6;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; border-collapse: collapse;">
                        <tr>
                            <td style="background: linear-gradient(135deg, #2D473E 0%, #3d5d52 100%); color: #F7F6F2; padding: 22px 24px; border-radius: 14px 14px 0 0;">
                                <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 900; letter-spacing: -0.02em;">Sekar Industries</div>
                                <div style="margin-top: 6px; font-family: Montserrat, Segoe UI, Arial, sans-serif; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.9;">Password Reset Verification</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ffffff; border: 1px solid #e5e3df; border-top: 0; padding: 24px; border-radius: 0 0 14px 14px; box-shadow: 0 8px 20px rgba(45, 71, 62, 0.08);">
                                <p style="margin: 0 0 12px 0; color: #4f4d47; font-size: 15px;">Use the OTP below to reset your password.</p>
                                <div style="margin: 14px 0 10px 0; text-align: center;">
                                    <span style="display: inline-block; padding: 14px 22px; background: #ffffff; border: 2px solid #2D473E; border-radius: 10px; font-family: 'Courier New', Consolas, monospace; font-size: 34px; font-weight: 800; letter-spacing: 4px; color: #1d2f28; line-height: 1;">
                                        ${otp}
                                    </span>
                                </div>
                                <p style="margin: 0 0 16px 0; text-align: center; color: #2D473E; font-family: Arial, sans-serif; font-size: 16px; font-weight: 700;">
                                    OTP: ${otp}
                                </p>
                                <div style="margin: 0 0 14px 0; padding: 10px 12px; background: #f0eeea; border-left: 4px solid #D4A574; color: #4f4d47; font-size: 14px; border-radius: 6px;">
                                    This OTP expires in <strong>10 minutes</strong>.
                                </div>
                                <p style="margin: 0; color: #6f6d67; font-size: 13px;">For your security, never share this OTP with anyone.</p>
                            </td>
                        </tr>
                    </table>
                </div>
            `
        });

        return { sent: true };
    } catch (mailError) {
        const reason = mailError?.response || mailError?.message || 'Unknown SMTP error';
        console.error('OTP email send failed:', reason);
        return {
            sent: false,
            reason
        };
    }
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

        const emailResult = await sendResetOtpEmail(user.email, otp);
        const emailSent = Boolean(emailResult?.sent);

        if (!emailSent) {
            console.log(`[PASSWORD RESET] OTP for ${user.email}: ${otp} (expires in 10 min)`);
        }

        return res.json({
            success: true,
            message: emailSent
                ? 'OTP has been sent to your email.'
                : 'OTP generated, but email delivery failed. Please check backend logs.',
            ...(process.env.NODE_ENV !== 'production' && {
                ...(!emailSent && { mail_error: emailResult?.reason || 'Unknown email error' })
            })
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
