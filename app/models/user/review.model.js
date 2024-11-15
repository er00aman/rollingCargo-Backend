import mongoose from 'mongoose';
import generateUniqueId from 'generate-unique-id';

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewId: {
        type: String,
        unique: true,
        default: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase())
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


ReviewSchema.index({ userId: 1, orderId: 1 });

const ReviewModel = mongoose.model('Review', ReviewSchema);

export default ReviewModel;
