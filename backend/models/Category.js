import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: 'grid' },
    description: { type: String, trim: true, default: '' },
    productCount: { type: Number, default: 0 },
    color: { type: String, default: '#2D473E' }
}, { timestamps: true });

categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret.categoryId;
        delete ret._id;
        return ret;
    }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
