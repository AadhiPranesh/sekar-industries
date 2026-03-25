import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// GET /api/categories — public
router.get('/', async (req, res) => {
    try {
        console.log('📂 GET /api/categories - Fetching all categories');
        const startTime = Date.now();
        const categories = await Category.find({}).sort({ categoryId: 1 }).lean();
        const data = categories.map(c => ({ ...c, id: c.categoryId }));
        const duration = Date.now() - startTime;
        console.log(`✅ Categories fetched: ${data.length} items in ${duration}ms`);
        return res.json({ success: true, data });
    } catch (error) {
        console.error('❌ Error fetching categories:', error.message);
        return res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
});

// GET /api/categories/:id — public
router.get('/:id', async (req, res) => {
    try {
        console.log(`📂 GET /api/categories/${req.params.id}`);
        const category = await Category.findOne({ categoryId: req.params.id }).lean();
        if (!category) {
            console.warn(`⚠️ Category not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        console.log(`✅ Category found: ${category.categoryId} - ${category.name}`);
        return res.json({ success: true, data: { ...category, id: category.categoryId } });
    } catch (error) {
        console.error('❌ Error fetching category:', error.message);
        return res.status(500).json({ success: false, message: 'Error fetching category' });
    }
});

export default router;
