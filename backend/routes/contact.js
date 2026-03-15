import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// POST /api/contact — public, submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message, quantity, purchaseType } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, subject and message are required'
            });
        }

        const contact = new ContactMessage({ name, email, phone, subject, message, quantity, purchaseType });
        await contact.save();

        console.log(`[CONTACT] New message from ${name} <${email}>: ${subject}`);

        return res.status(201).json({
            success: true,
            message: parseInt(quantity) >= 10
                ? 'Thank you for your bulk inquiry! Our sales team will prioritize your request and contact you within 24 hours.'
                : 'Thank you for your message! We will get back to you soon.'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ success: false, message: 'Error submitting message. Please try again.' });
    }
});

// GET /api/contact/admin — admin only, list all messages
router.get('/admin', verifyToken, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        return res.json({ success: true, messages });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
});

// PATCH /api/contact/admin/:id/read — admin only, mark as read
router.patch('/admin/:id/read', verifyToken, async (req, res) => {
    try {
        await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true });
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating message' });
    }
});

export default router;
