import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// GET /api/categories — public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ categoryId: 1 }).lean();
        const data = categories.map(c => ({ ...c, id: c.categoryId }));
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
});

// GET /api/categories/:id — public
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findOne({ categoryId: req.params.id }).lean();
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        return res.json({ success: true, data: { ...category, id: category.categoryId } });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching category' });
    }
});

export default router;
