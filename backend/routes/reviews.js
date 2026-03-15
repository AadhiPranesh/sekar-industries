import express from 'express';
import Review from '../models/Review.js';
import Sale from '../models/Sale.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const normalize = (value) => String(value || '').trim();

const requireUserSession = (req, res, next) => {
    if (!req.session?.userId) {
        return res.status(401).json({
            success: false,
            message: 'Please log in to continue.'
        });
    }

    return next();
};

router.post('/verify-bill', requireUserSession, async (req, res) => {
    try {
        const billNumber = normalize(req.body.billNumber).toUpperCase();
        const productId = normalize(req.body.productId);

        if (!billNumber) {
            return res.status(400).json({
                success: false,
                message: 'Bill number is required.'
            });
        }

        const sale = await Sale.findOne({ billNumber }).lean();

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Bill number not found.'
            });
        }

        if (sale.hasBeenReviewed) {
            return res.status(409).json({
                success: false,
                message: 'This bill has already been used for a review.'
            });
        }

        if (productId && sale.productId && sale.productId !== productId) {
            return res.status(400).json({
                success: false,
                message: 'This bill does not belong to the selected product.'
            });
        }

        return res.json({
            success: true,
            product: {
                billNumber: sale.billNumber,
                productId: sale.productId,
                productName: sale.productName,
                purchaseDate: sale.saleDate,
                amount: sale.amount
            }
        });
    } catch (error) {
        console.error('Verify bill error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify bill number.'
        });
    }
});

router.post('/submit', requireUserSession, async (req, res) => {
    try {
        const billNumber = normalize(req.body.billNumber).toUpperCase();
        const productId = normalize(req.body.productId);
        const rating = Number.parseInt(req.body.rating, 10);
        const reviewText = normalize(req.body.reviewText);
        const images = Array.isArray(req.body.images) ? req.body.images.slice(0, 5) : [];

        if (!billNumber || !rating || rating < 1 || rating > 5 || !reviewText || reviewText.length < 20) {
            return res.status(400).json({
                success: false,
                message: 'Bill number, rating and valid review text are required.'
            });
        }

        const sale = await Sale.findOne({ billNumber });

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Bill number not found.'
            });
        }

        if (sale.hasBeenReviewed) {
            return res.status(409).json({
                success: false,
                message: 'This bill has already been used for a review.'
            });
        }

        if (productId && sale.productId && sale.productId !== productId) {
            return res.status(400).json({
                success: false,
                message: 'This bill does not belong to the selected product.'
            });
        }

        const review = await Review.create({
            userId: req.session.userId,
            billNumber,
            productId: sale.productId,
            productName: sale.productName,
            userName: req.session?.user?.name || 'Customer',
            rating,
            reviewText,
            images,
            status: 'pending'
        });

        sale.hasBeenReviewed = true;
        await sale.save();

        return res.status(201).json({
            success: true,
            review
        });
    } catch (error) {
        console.error('Submit review error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to submit review.'
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const productId = normalize(req.query.productId);
        const query = { status: 'approved' };

        if (productId) {
            query.productId = productId;
        }

        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error('Fetch public reviews error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load reviews.'
        });
    }
});

router.get('/admin', verifyToken, async (req, res) => {
    try {
        const status = normalize(req.query.status).toLowerCase();
        const query = {};

        if (['pending', 'approved', 'rejected'].includes(status)) {
            query.status = status;
        }

        const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

        return res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error('Fetch admin reviews error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load admin reviews.'
        });
    }
});

router.patch('/admin/:id', verifyToken, async (req, res) => {
    try {
        const status = normalize(req.body.status).toLowerCase();
        const ownerReply = normalize(req.body.ownerReply);
        const updatePayload = {};

        if (['pending', 'approved', 'rejected'].includes(status)) {
            updatePayload.status = status;
        }

        if (typeof req.body.ownerReply === 'string') {
            updatePayload.ownerReply = ownerReply;
        }

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update.'
            });
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: updatePayload },
            { new: true, runValidators: true }
        ).lean();

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found.'
            });
        }

        return res.json({
            success: true,
            review
        });
    } catch (error) {
        console.error('Update admin review error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update review.'
        });
    }
});

export default router;
