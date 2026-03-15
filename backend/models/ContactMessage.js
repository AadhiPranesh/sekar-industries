import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    quantity: { type: String },
    purchaseType: { type: String, enum: ['retail', 'wholesale'], default: 'retail' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
