import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true
        },
        billNumber: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            index: true
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
        userName: {
            type: String,
            trim: true,
            default: 'Customer'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        reviewText: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        images: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
            index: true
        },
        ownerReply: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ status: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
