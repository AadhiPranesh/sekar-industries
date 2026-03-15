import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
    {
        billNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        productId: {
            type: String,
            trim: true,
            default: ''
        },
        productName: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        saleDate: {
            type: Date,
            default: Date.now
        },
        hasBeenReviewed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

saleSchema.index({ createdAt: -1 });
saleSchema.index({ hasBeenReviewed: 1, createdAt: -1 });

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;
