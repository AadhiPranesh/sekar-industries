import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
        cb(null, `prod-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
});

const imageUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
});

// Helper to add availability to a plain product object
const serializeProduct = (p) => {
    const base = {
        ...p,
        id: p.productId,
        image: p.image || ''
    };

    delete base._id;
    delete base.__v;

    return base;
};

const withAvailability = (p) => ({
    ...serializeProduct(p),
    availability: p.stock === 0
        ? { status: 'out-of-stock', label: 'Out of Stock', color: '#dc3545' }
        : p.stock <= p.lowStockThreshold
            ? { status: 'low-stock', label: 'Low Stock', color: '#ffc107' }
            : { status: 'in-stock', label: 'In Stock', color: '#28a745' }
});

const normalizeNumber = (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
};

const normalizeBoolean = (value) => {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
    }
    return undefined;
};

const buildProductFilter = (query = {}) => {
    const { category, featured, lowStock, outOfStock } = query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (outOfStock === 'true') filter.stock = 0;
    if (lowStock === 'true') filter.stock = { $gt: 0 };
    return filter;
};

const applySearchAndLowStock = (products, query = {}) => {
    const { lowStock, q, search } = query;
    let result = products;

    if (lowStock === 'true') {
        result = result.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
    }

    const text = q || search;
    if (text) {
        const lower = text.toLowerCase();
        result = result.filter((p) =>
            p.name.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower) ||
            (p.description || '').toLowerCase().includes(lower)
        );
    }

    return result;
};

const getProductLookupQuery = (id) => {
    const query = { $or: [{ productId: id }] };
    if (mongoose.Types.ObjectId.isValid(id)) query.$or.push({ _id: id });
    return query;
};

// POST /api/products/upload-image — admin only
router.post('/upload-image', verifyToken, (req, res) => {
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'Image must be 5MB or smaller' });
            }
            return res.status(400).json({ success: false, message: err.message || 'Image upload failed' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const imageUrl = `/uploads/products/${req.file.filename}`;
        return res.status(201).json({ success: true, imageUrl });
    });
});

// GET /api/products — public
router.get('/', async (req, res) => {
    try {
        const filter = buildProductFilter(req.query);
        const products = await Product.find(filter).sort({ productId: 1 }).lean();
        const filtered = applySearchAndLowStock(products, req.query);

        return res.json({
            success: true,
            data: filtered.map(withAvailability)
        });
    } catch (error) {
        console.error('Get products error:', error);
        return res.status(500).json({ success: false, message: 'Error fetching products' });
    }
});

// GET /api/products/admin — admin only
router.get('/admin', verifyToken, async (req, res) => {
    try {
        const filter = buildProductFilter(req.query);
        const products = await Product.find(filter).sort({ productId: 1 }).lean();
        const filtered = applySearchAndLowStock(products, req.query);
        return res.json({ success: true, data: filtered.map(withAvailability) });
    } catch (error) {
        console.error('Get admin products error:', error);
        return res.status(500).json({ success: false, message: 'Error fetching products' });
    }
});

// GET /api/products/admin/:id — admin only
router.get('/admin/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findOne(getProductLookupQuery(req.params.id)).lean();
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.json({ success: true, data: withAvailability(product) });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching product' });
    }
});

// GET /api/products/search — public
router.get('/search', async (req, res) => {
    try {
        const { q = '' } = req.query;
        const lower = q.toLowerCase();
        const products = await Product.find({}).lean();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower) ||
            p.description.toLowerCase().includes(lower)
        );
        return res.json({ success: true, data: filtered.map(withAvailability) });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error searching products' });
    }
});

// GET /api/products/:id — public (productId like 'prod-001')
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne(getProductLookupQuery(req.params.id)).lean();
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.json({ success: true, data: withAvailability(product) });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching product' });
    }
});

// POST /api/products — admin only
router.post('/', verifyToken, async (req, res) => {
    try {
        const {
            productId,
            name,
            category,
            categoryId,
            description,
            price,
            unit,
            stock,
            lowStockThreshold,
            isFeatured,
            isNew,
            image
        } = req.body;

        if (!productId || !name || !category || price === undefined || stock === undefined) {
            return res.status(400).json({ success: false, message: 'productId, name, category, price and stock are required' });
        }

        const priceNumber = normalizeNumber(price);
        const stockNumber = normalizeNumber(stock);
        const thresholdNumber = normalizeNumber(lowStockThreshold);
        const featuredBool = normalizeBoolean(isFeatured);
        const isNewBool = normalizeBoolean(isNew);

        if (priceNumber === undefined || stockNumber === undefined) {
            return res.status(400).json({ success: false, message: 'price and stock must be valid numbers' });
        }

        const existing = await Product.findOne({ productId });
        if (existing) return res.status(409).json({ success: false, message: 'Product ID already exists' });

        const product = await Product.create({
            productId,
            name,
            category,
            categoryId,
            description,
            price: priceNumber,
            unit,
            stock: stockNumber,
            lowStockThreshold: thresholdNumber !== undefined ? thresholdNumber : 10,
            isFeatured: featuredBool !== undefined ? featuredBool : false,
            isNew: isNewBool !== undefined ? isNewBool : false,
            image
        });

        return res.status(201).json({ success: true, data: withAvailability(product.toJSON()) });
    } catch (error) {
        console.error('Create product error:', error);
        return res.status(500).json({ success: false, message: 'Error creating product' });
    }
});

// PATCH /api/products/:id — admin only
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const allowed = ['name', 'category', 'categoryId', 'description', 'price', 'unit', 'stock', 'lowStockThreshold', 'isFeatured', 'isNew', 'image', 'rating', 'reviewCount', 'productId'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        if (updates.price !== undefined) {
            const normalized = normalizeNumber(updates.price);
            if (normalized === undefined) return res.status(400).json({ success: false, message: 'price must be a valid number' });
            updates.price = normalized;
        }
        if (updates.stock !== undefined) {
            const normalized = normalizeNumber(updates.stock);
            if (normalized === undefined) return res.status(400).json({ success: false, message: 'stock must be a valid number' });
            updates.stock = normalized;
        }
        if (updates.lowStockThreshold !== undefined) {
            const normalized = normalizeNumber(updates.lowStockThreshold);
            if (normalized === undefined) return res.status(400).json({ success: false, message: 'lowStockThreshold must be a valid number' });
            updates.lowStockThreshold = normalized;
        }
        if (updates.rating !== undefined) {
            const normalized = normalizeNumber(updates.rating);
            if (normalized === undefined) return res.status(400).json({ success: false, message: 'rating must be a valid number' });
            updates.rating = normalized;
        }
        if (updates.reviewCount !== undefined) {
            const normalized = normalizeNumber(updates.reviewCount);
            if (normalized === undefined) return res.status(400).json({ success: false, message: 'reviewCount must be a valid number' });
            updates.reviewCount = normalized;
        }
        if (updates.isFeatured !== undefined) {
            const normalized = normalizeBoolean(updates.isFeatured);
            if (normalized === undefined) return res.status(400).json({ success: false, message: 'isFeatured must be true or false' });
            updates.isFeatured = normalized;
        }
        if (updates.isNew !== undefined) {
            const normalized = normalizeBoolean(updates.isNew);
            if (normalized === undefined) return res.status(400).json({ success: false, message: 'isNew must be true or false' });
            updates.isNew = normalized;
        }

        const currentProduct = await Product.findOne(getProductLookupQuery(req.params.id)).lean();
        if (!currentProduct) return res.status(404).json({ success: false, message: 'Product not found' });

        if (updates.productId) {
            const duplicate = await Product.findOne({
                productId: updates.productId,
                _id: { $ne: currentProduct._id }
            }).lean();
            if (duplicate) return res.status(409).json({ success: false, message: 'Product ID already exists' });
        }

        const product = await Product.findOneAndUpdate(
            { _id: currentProduct._id },
            { $set: updates },
            { new: true, runValidators: true }
        ).lean();

        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.json({ success: true, data: withAvailability(product) });
    } catch (error) {
        console.error('Update product error:', error);
        return res.status(500).json({ success: false, message: 'Error updating product' });
    }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete(getProductLookupQuery(req.params.id));
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting product' });
    }
});

export default router;
