import express from 'express';
import ProductRequest from '../models/ProductRequest.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const ALLOWED_STATUS = ['new', 'in_review', 'quoted', 'closed', 'rejected'];
const ALLOWED_PURCHASE_TYPE = ['retail', 'wholesale'];

const normalizeString = (value) => String(value || '').trim();

const getPriority = (quantity, purchaseType) => {
    if (quantity >= 10 || purchaseType === 'wholesale') {
        return 'high';
    }
    return 'normal';
};

const buildSearchRegex = (searchValue) => {
    const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
};

const requireUserSession = (req, res, next) => {
    if (!req.session?.userId || !req.session?.user?.email) {
        return res.status(401).json({
            success: false,
            message: 'Please log in to access your requests.'
        });
    }

    return next();
};

const buildMyRequestsQuery = (req) => {
    const sessionEmail = normalizeString(req.session?.user?.email).toLowerCase();

    if (!sessionEmail) {
        return { userId: req.session.userId };
    }

    return {
        $or: [
            { userId: req.session.userId },
            { 'customer.email': sessionEmail }
        ]
    };
};

router.post('/', requireUserSession, async (req, res) => {
    try {
        const customerName = normalizeString(req.body.customerName);
        const sessionEmail = normalizeString(req.session?.user?.email).toLowerCase();
        const customerEmail = sessionEmail || normalizeString(req.body.customerEmail).toLowerCase();
        const customerPhone = normalizeString(req.body.customerPhone);
        const company = normalizeString(req.body.company);

        const productId = normalizeString(req.body.productId);
        const productName = normalizeString(req.body.productName);
        const productPrice = normalizeString(req.body.productPrice);

        const quantity = Number.parseInt(req.body.quantity, 10);
        const purchaseType = normalizeString(req.body.purchaseType).toLowerCase() || 'retail';
        const message = normalizeString(req.body.message);

        if (!customerName || !customerEmail || !customerPhone || !productName || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, phone, product and quantity are required.'
            });
        }

        if (!/\S+@\S+\.\S+/.test(customerEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        if (!ALLOWED_PURCHASE_TYPE.includes(purchaseType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid purchase type.'
            });
        }

        const priority = getPriority(quantity, purchaseType);

        const createdRequest = await ProductRequest.create({
            userId: req.session?.userId || null,
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                company
            },
            product: {
                productId,
                productName,
                productPrice
            },
            request: {
                quantity,
                purchaseType,
                message
            },
            priority
        });

        return res.status(201).json({
            success: true,
            message: 'Request submitted successfully.',
            request: {
                id: createdRequest._id,
                status: createdRequest.status,
                priority: createdRequest.priority,
                createdAt: createdRequest.createdAt
            }
        });
    } catch (error) {
        console.error('Create product request error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to submit request. Please try again.'
        });
    }
});

router.get('/my/summary', requireUserSession, async (req, res) => {
    try {
        const myQuery = buildMyRequestsQuery(req);

        const [total, open, closed] = await Promise.all([
            ProductRequest.countDocuments(myQuery),
            ProductRequest.countDocuments({
                ...myQuery,
                status: { $in: ['new', 'in_review', 'quoted'] }
            }),
            ProductRequest.countDocuments({
                ...myQuery,
                status: { $in: ['closed', 'rejected'] }
            })
        ]);

        return res.json({
            success: true,
            summary: {
                total,
                open,
                closed
            }
        });
    } catch (error) {
        console.error('Fetch my request summary error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load your request summary.'
        });
    }
});

router.get('/my', requireUserSession, async (req, res) => {
    try {
        const status = normalizeString(req.query.status).toLowerCase();
        const query = buildMyRequestsQuery(req);

        if (status && status !== 'all') {
            query.status = status;
        }

        const requests = await ProductRequest.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Fetch my requests error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load your requests.'
        });
    }
});

router.use('/admin', verifyToken);

router.get('/admin', async (req, res) => {
    try {
        const status = normalizeString(req.query.status).toLowerCase();
        const priority = normalizeString(req.query.priority).toLowerCase();
        const search = normalizeString(req.query.search);

        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        if (search) {
            const searchRegex = buildSearchRegex(search);
            query.$or = [
                { 'customer.name': searchRegex },
                { 'customer.email': searchRegex },
                { 'customer.phone': searchRegex },
                { 'product.productName': searchRegex }
            ];
        }

        const requests = await ProductRequest.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Fetch product requests error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch requests.'
        });
    }
});

router.get('/admin/:id', async (req, res) => {
    try {
        const request = await ProductRequest.findById(req.params.id).lean();

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found.'
            });
        }

        return res.json({
            success: true,
            request
        });
    } catch (error) {
        console.error('Fetch product request detail error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch request details.'
        });
    }
});

router.patch('/admin/:id/status', async (req, res) => {
    try {
        const status = normalizeString(req.body.status).toLowerCase();

        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value.'
            });
        }

        const updatePayload = { status };
        if (status === 'closed' || status === 'rejected') {
            updatePayload.resolvedAt = new Date();
        }

        const updatedRequest = await ProductRequest.findByIdAndUpdate(
            req.params.id,
            { $set: updatePayload },
            { new: true }
        ).lean();

        if (!updatedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Request not found.'
            });
        }

        return res.json({
            success: true,
            message: 'Status updated successfully.',
            request: updatedRequest
        });
    } catch (error) {
        console.error('Update product request status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update status.'
        });
    }
});

router.patch('/admin/:id', async (req, res) => {
    try {
        const status = normalizeString(req.body.status).toLowerCase();
        const ownerNotes = normalizeString(req.body.ownerNotes);
        const followUpDateRaw = normalizeString(req.body.followUpDate);
        const quotedPrice = req.body.quotedPrice;

        const updatePayload = {};

        if (ownerNotes) {
            updatePayload.ownerNotes = ownerNotes;
        }

        if (status) {
            if (!ALLOWED_STATUS.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status value.'
                });
            }
            updatePayload.status = status;
            if (status === 'closed' || status === 'rejected') {
                updatePayload.resolvedAt = new Date();
            }
        }

        if (followUpDateRaw) {
            const followUpDate = new Date(followUpDateRaw);
            if (Number.isNaN(followUpDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid follow-up date.'
                });
            }
            updatePayload.followUpDate = followUpDate;
        }

        if (quotedPrice !== undefined && quotedPrice !== null && quotedPrice !== '') {
            const parsedQuotedPrice = Number(quotedPrice);
            if (!Number.isFinite(parsedQuotedPrice) || parsedQuotedPrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Quoted price must be a valid non-negative number.'
                });
            }
            updatePayload.quotedPrice = parsedQuotedPrice;
        }

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update.'
            });
        }

        const updatedRequest = await ProductRequest.findByIdAndUpdate(
            req.params.id,
            { $set: updatePayload },
            { new: true }
        ).lean();

        if (!updatedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Request not found.'
            });
        }

        return res.json({
            success: true,
            message: 'Request updated successfully.',
            request: updatedRequest
        });
    } catch (error) {
        console.error('Update product request error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update request.'
        });
    }
});

export default router;
