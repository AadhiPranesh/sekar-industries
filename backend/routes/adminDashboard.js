import express from 'express';
import axios from 'axios';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const normalizeBaseUrl = (value) => String(value || '').trim().replace(/\/+$/, '');

const SALES_PREDICTION_BASE_URL = normalizeBaseUrl(
    process.env.SALES_PREDICTION_URL
        || process.env.ANALYTICS_API_URL
        || (process.env.NODE_ENV === 'production'
            ? 'https://sekar-industries-1.onrender.com'
            : 'http://127.0.0.1:8000')
);

router.use(verifyToken);

// Route: GET /api/adminDashboard/predict/:id
router.get('/predict/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        console.log(`Frontend requested prediction for: ${productId}`);

        const mlResponse = await axios.get(`${SALES_PREDICTION_BASE_URL}/dashboard/${productId}`);
        
        res.json(mlResponse.data);
        
    } catch (error) {
        console.error("Error connecting to ML Service:", error.message);
        
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({ 
            message: "Forecasting service unavailable.", 
            error: error.message 
        });
    }
});

export default router;