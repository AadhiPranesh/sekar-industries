import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Sale from '../models/Sale.js';
import Review from '../models/Review.js';
import { mockProducts } from '../../frontend/src/data/mockProducts.js';
import { mockCategories } from '../../frontend/src/data/mockCategories.js';

dotenv.config();

const mapCategory = (category) => ({
    categoryId: category.id,
    name: category.name,
    icon: category.icon,
    description: category.description,
    productCount: category.productCount || 0,
    color: category.color || '#2D473E'
});

const mapProduct = (product) => ({
    productId: product.id,
    name: product.name,
    category: product.category,
    categoryId: product.categoryId || '',
    description: product.description || '',
    price: Number(product.price) || 0,
    unit: product.unit || 'piece',
    stock: Number(product.stock) || 0,
    lowStockThreshold: Number(product.lowStockThreshold) || 10,
    isFeatured: Boolean(product.isFeatured),
    isNew: Boolean(product.isNew),
    rating: Number(product.rating) || 0,
    reviewCount: Number(product.reviewCount) || 0,
    image: product.image || ''
});

const reviewerNames = [
    'Arun Kumar',
    'Divya S',
    'Prakash R',
    'Meena K',
    'Santhosh V',
    'Lakshmi P',
    'Vignesh M',
    'Keerthana R',
    'Suresh B',
    'Nandhini T'
];

const reviewTemplates = [
    'Very good quality and the finish looks premium. It is sturdy in daily use and worth the price.',
    'Good product quality with solid construction. Delivery was smooth and the item matched the photos.',
    'Comfortable, reliable, and well finished. We bought it for regular use and it has performed well.',
    'The build quality is strong and the design is practical. Happy with the purchase and service support.',
    'Value for money product. Material quality is good and it was packed and delivered properly.',
    'Looks neat, feels durable, and the overall quality is satisfying. Recommended for home and office use.'
];

const ownerReplies = [
    'Thank you for your feedback. We are glad the product met your expectations.',
    'We appreciate your review and continued support for Sekar Industries.',
    'Thank you for sharing your experience. We look forward to serving you again.'
];

const clampRating = (value) => Math.min(5, Math.max(1, Math.round(value)));

const buildMockReviewContent = (product, index) => {
    const text = reviewTemplates[index % reviewTemplates.length];
    const productContext = `${product.name} has been useful and dependable after purchase.`;
    return `${text} ${productContext}`;
};

const buildSalesAndReviews = (products) => {
    const sales = [];
    const reviews = [];
    const now = new Date();

    for (const [productIndex, product] of products.entries()) {
        const targetReviews = Math.max(2, Math.min(6, Math.round((Number(product.reviewCount) || 0) / 35) || 2));

        for (let reviewIndex = 0; reviewIndex < targetReviews; reviewIndex += 1) {
            const billNumber = `FEED-${product.productId}-${String(reviewIndex + 1).padStart(2, '0')}`;
            const quantity = 1 + ((productIndex + reviewIndex) % 3);
            const saleDate = new Date(now);
            saleDate.setDate(now.getDate() - (productIndex * 4 + reviewIndex * 9 + 5));

            sales.push({
                billNumber,
                productId: product.productId,
                productName: product.name,
                quantity,
                amount: Math.round((Number(product.price) || 0) * quantity),
                saleDate,
                hasBeenReviewed: true
            });

            const createdAt = new Date(saleDate);
            createdAt.setDate(createdAt.getDate() + 2);

            const ratingBase = Number(product.rating) || 4;
            const rating = clampRating(ratingBase + ((reviewIndex % 3) - 1) * 0.4);

            reviews.push({
                billNumber,
                productId: product.productId,
                productName: product.name,
                userName: reviewerNames[(productIndex + reviewIndex) % reviewerNames.length],
                rating,
                reviewText: buildMockReviewContent(product, reviewIndex),
                images: [],
                status: 'approved',
                ownerReply: reviewIndex % 2 === 0 ? ownerReplies[(productIndex + reviewIndex) % ownerReplies.length] : '',
                createdAt,
                updatedAt: createdAt
            });
        }
    }

    return { sales, reviews };
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected.');

        let categoryInserted = 0;
        let categoryUpdated = 0;
        let categoryUnchanged = 0;

        for (const category of mockCategories) {
            const mappedCategory = mapCategory(category);
            const result = await Category.updateOne(
                { categoryId: mappedCategory.categoryId },
                { $set: mappedCategory },
                { upsert: true }
            );

            if (result.upsertedCount) {
                categoryInserted += 1;
            } else if (result.modifiedCount) {
                categoryUpdated += 1;
            } else {
                categoryUnchanged += 1;
            }
        }

        let productInserted = 0;
        let productUpdated = 0;
        let productUnchanged = 0;

        for (const product of mockProducts) {
            const mappedProduct = mapProduct(product);
            const result = await Product.updateOne(
                { productId: mappedProduct.productId },
                { $set: mappedProduct },
                { upsert: true }
            );

            if (result.upsertedCount) {
                productInserted += 1;
            } else if (result.modifiedCount) {
                productUpdated += 1;
            } else {
                productUnchanged += 1;
            }
        }

        const storedProducts = await Product.find({}).lean();
        const { sales, reviews } = buildSalesAndReviews(storedProducts);

        await Review.deleteMany({ billNumber: /^FEED-/ });
        await Sale.deleteMany({ billNumber: /^FEED-/ });

        if (sales.length > 0) {
            await Sale.insertMany(sales, { ordered: false });
        }

        if (reviews.length > 0) {
            await Review.insertMany(reviews, { ordered: false });
        }

        console.log(`Categories -> new: ${categoryInserted}, updated: ${categoryUpdated}, unchanged: ${categoryUnchanged}`);
        console.log(`Products   -> new: ${productInserted}, updated: ${productUpdated}, unchanged: ${productUnchanged}`);
        console.log(`Sales      -> inserted: ${sales.length}`);
        console.log(`Reviews    -> inserted: ${reviews.length}`);
        console.log('Frontend data has been fed into backend successfully.');
    } catch (error) {
        console.error('Seed from frontend data failed:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

run();
