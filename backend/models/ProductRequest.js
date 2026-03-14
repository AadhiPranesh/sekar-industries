import mongoose from 'mongoose';

const productRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true
        },
        customer: {
            name: { type: String, required: true, trim: true },
            email: { type: String, required: true, trim: true, lowercase: true },
            phone: { type: String, required: true, trim: true },
            company: { type: String, trim: true, default: '' }
        },
        product: {
            productId: { type: String, trim: true, default: '' },
            productName: { type: String, required: true, trim: true },
            productPrice: { type: String, trim: true, default: '' }
        },
        request: {
            quantity: { type: Number, required: true, min: 1 },
            purchaseType: {
                type: String,
                enum: ['retail', 'wholesale'],
                default: 'retail'
            },
            message: { type: String, trim: true, default: '' }
        },
        status: {
            type: String,
            enum: ['new', 'in_review', 'quoted', 'closed', 'rejected'],
            default: 'new'
        },
        priority: {
            type: String,
            enum: ['normal', 'high'],
            default: 'normal'
        },
        ownerNotes: { type: String, trim: true, default: '' },
        quotedPrice: { type: Number, default: null },
        followUpDate: { type: Date, default: null },
        resolvedAt: { type: Date, default: null }
    },
    {
        timestamps: true
    }
);

productRequestSchema.index({ status: 1, createdAt: -1 });
productRequestSchema.index({ priority: 1, createdAt: -1 });
productRequestSchema.index({ userId: 1, createdAt: -1 });
productRequestSchema.index({ 'customer.email': 1, createdAt: -1 });

const ProductRequest = mongoose.model('ProductRequest', productRequestSchema);

export default ProductRequest;
