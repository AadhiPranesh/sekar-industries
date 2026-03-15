import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    categoryId: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'piece' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, default: '' }
}, { timestamps: true });

productSchema.virtual('availability').get(function () {
    if (this.stock === 0) return { status: 'out-of-stock', label: 'Out of Stock', color: '#dc3545' };
    if (this.stock <= this.lowStockThreshold) return { status: 'low-stock', label: 'Low Stock', color: '#ffc107' };
    return { status: 'in-stock', label: 'In Stock', color: '#28a745' };
});

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret.productId;
        delete ret._id;
        return ret;
    }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
