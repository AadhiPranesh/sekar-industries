import express from 'express';
import axios from 'axios';

const router = express.Router();

// Route: GET /api/adminDashboard/predict/:id
router.get('/predict/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        console.log(`Frontend requested prediction for: ${productId}`);

        const mlResponse = await axios.get(`http://127.0.0.1:8000/dashboard/${productId}`);
        
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