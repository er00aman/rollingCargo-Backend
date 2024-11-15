import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
    {
        shipmentId: {
            type: String,
            default: () => generateUniqueId({ length: 10, useLetters: true }).toUpperCase(),
            unique: true,
        },
        goodsQuotationRequestId: {
            type: mongoose.Types.ObjectId,
            ref: 'GoodsQuotationRequest',
            required: true,
        },
        senderDetails: {
            name: { type: String },
            mobileNo: { type: String },
            address: { type: String },
        },
        receiverDetails: {
            name: { type: String },
            mobileNo: { type: String },
            address: { type: String },
        },
        status: {
            type: Number,
            default: 0, // 0 for pending, 1 for in transit, 2 for delivered, 3 for cancelled
        },
        deliveryStatus: {
            type: Number,
            default: 0, // 0 for not started, 1 for in progress, 2 for completed
        },
        trackingInfo: [
            {
                status: String,
                location: String,
                timestamp: { type: Date, default: Date.now },
            },
        ],
        currentLocation: {
            type: String,
            default: '',
        },
        estimatedDeliveryDate: {
            type: Date,
        },
        actualDeliveryDate: {
            type: Date,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        comments: {
            type: String,
            default: '',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: 'Shipments',
        versionKey: false,
        timestamps: true,
    }
);

const ShipmentModel = mongoose.model('Shipment', shipmentSchema);
export default ShipmentModel;
