import express from 'express';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const normalize = (value) => String(value || '').trim();

router.post('/admin', verifyToken, async (req, res) => {
    try {
        const billNumber = normalize(req.body.billNumber).toUpperCase();
        const productId = normalize(req.body.productId);
        const productName = normalize(req.body.productName);
        const quantity = Number.parseInt(req.body.quantity, 10);
        const amount = Number.parseFloat(req.body.amount);
        const saleDateRaw = normalize(req.body.saleDate);

        if (!billNumber || !productName || !quantity || quantity < 1 || Number.isNaN(amount) || amount < 0) {
            return res.status(400).json({
                success: false,
                message: 'Bill number, product name, quantity and amount are required.'
            });
        }

        const existing = await Sale.findOne({ billNumber }).lean();
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'This bill number already exists.'
            });
        }

        const parsedSaleDate = saleDateRaw ? new Date(saleDateRaw) : new Date();

        const sale = await Sale.create({
            billNumber,
            productId,
            productName,
            quantity,
            amount,
            saleDate: Number.isNaN(parsedSaleDate.getTime()) ? new Date() : parsedSaleDate
        });

        return res.status(201).json({
            success: true,
            sale
        });
    } catch (error) {
        console.error('Create sale error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to save sale.'
        });
    }
});

router.get('/admin/recent', verifyToken, async (req, res) => {
    try {
        const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);
        const sales = await Sale.find({}).sort({ createdAt: -1 }).limit(limit).lean();

        return res.json({
            success: true,
            sales
        });
    } catch (error) {
        console.error('Fetch sales error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load recent sales.'
        });
    }
});

// GET /api/sales/admin/stats — today's sales totals + low stock products
router.get('/admin/stats', verifyToken, async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const todaySales = await Sale.find({ saleDate: { $gte: todayStart, $lte: todayEnd } }).lean();
        const todaySalesTotal = todaySales.reduce((sum, s) => sum + (s.amount || 0), 0);
        const todayProductsSold = todaySales.reduce((sum, s) => sum + (s.quantity || 0), 0);

        const allProducts = await Product.find({}).lean();
        const lowStockProducts = allProducts
            .filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold)
            .map(p => ({ id: p.productId, name: p.name, stock: p.stock, category: p.category }));
        const outOfStock = allProducts.filter(p => p.stock === 0).length;

        return res.json({
            success: true,
            stats: {
                todaySales: todaySalesTotal,
                productsSold: todayProductsSold,
                lowStockCount: lowStockProducts.length,
                outOfStockCount: outOfStock,
                lowStockProducts,
                lastUpdated: now
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        return res.status(500).json({ success: false, message: 'Error loading stats' });
    }
});

// GET /api/sales/admin/trend?range=1M|2M|3M|6M|1Y
router.get('/admin/trend', verifyToken, async (req, res) => {
    try {
        const { range = '1M' } = req.query;
        const now = new Date();

        const rangeConfig = {
            '1M': { days: 30, groupBy: 'day' },
            '2M': { days: 60, groupBy: 'day' },
            '3M': { days: 90, groupBy: 'week' },
            '6M': { days: 180, groupBy: 'week' },
            '1Y': { days: 365, groupBy: 'month' }
        };
        const config = rangeConfig[range] || rangeConfig['1M'];

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - config.days);
        startDate.setHours(0, 0, 0, 0);

        const sales = await Sale.find({ saleDate: { $gte: startDate } }).lean();

        // Build a map by date key
        const salesMap = {};
        for (const sale of sales) {
            const d = new Date(sale.saleDate);
            let key;
            if (config.groupBy === 'day') {
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            } else if (config.groupBy === 'week') {
                // ISO week start (Monday)
                const day = d.getDay() || 7;
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - day + 1);
                key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
            } else {
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            }
            salesMap[key] = (salesMap[key] || 0) + (sale.amount || 0);
        }

        // Build the ordered data array
        const data = [];

        if (config.groupBy === 'day') {
            for (let i = config.days - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                const showLabel = config.days <= 30 || i % 3 === 0;
                data.push({
                    label: showLabel ? String(d.getDate()) : '',
                    fullDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                    sales: salesMap[key] || 0
                });
            }
        } else if (config.groupBy === 'week') {
            const weeks = Math.ceil(config.days / 7);
            for (let i = weeks - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i * 7);
                const day = d.getDay() || 7;
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - day + 1);
                const key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
                data.push({
                    label: weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                    fullDate: `Week of ${weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
                    sales: salesMap[key] || 0
                });
            }
        } else {
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                data.push({
                    label: d.toLocaleDateString('en-IN', { month: 'short' }),
                    fullDate: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                    sales: salesMap[key] || 0
                });
            }
        }

        return res.json({ success: true, data });
    } catch (error) {
        console.error('Trend error:', error);
        return res.status(500).json({ success: false, message: 'Error loading trend data' });
    }
});

export default router;
