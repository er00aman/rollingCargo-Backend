import mongoose from "mongoose";
import generateUniqueId from 'generate-unique-id';

const goodsQuotationRequestSchema = new mongoose.Schema(
    {
        requestingUser: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        requestId: {
            type: String,
            default: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase())
        },
        shippingType: {
            type: Number,
            default: 1,  // 1 - calculate shipment, 2 - small Goods, 3 - large Goods, 4 - export
        },
        shippingMode: {
            type: Number,
            default: 1,  // 1 for air-freight, 2 for sea-freight
        },
        sendingCountry: {
            type: String,
            required: true
        },
        sendingCity: {
            type: String,
            required: true
        },
        receivingCountry: {
            type: String,
            required: true
        },
        receivingCity: {
            type: String,
            default: ""
        },
        goodsType: {
            type: mongoose.Types.ObjectId,
            ref: "GoodsCategory"
        },
        goodsWeight: {
            type: Number,
        },
        goodsDescription: {
            type: String,
            default: ""
        },
        goodsImages: [],
        receiverName: {
            type: String,
            default: ""
        },
        receiverMobileNo: {
            type: String,
            default: ""
        },
        receiverAddress: {
            type: String,
            default: ""
        },
        exportAddress: {
            houseNumber: {
                type: String,
            },
            streetNumber: {
                type: String,
            },
            streetName: {
                type: String,
            },
            city: {
                type: String,
            },
            zipCode: {
                type: String,
            },
        },
        repackagePrice: {
            type: Number,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        taxAmount: {
            type: Number,
            default: 0,
        },
        goodsLength: {
            type: Number,
            default: null
        },
        goodsWidth: {
            type: Number,
            default: null,
        },
        goodsHeight: {
            type: Number,
            default: null,
        },
        isRepackaging: {
            type: Number,
            default: 0 // 0 for no,1 for yes
        },
        status: {
            type: Number,
            default: 0 // 0 for pending, 1 for respond by admin ,2 rejected by admin, 3 for order placed
        },
        goodsVolume: {
            type: Number,
            default: null,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        requestedAt: {
            type: Number,
            default: new Date().getTime(),
        },
        updatedAt: {
            type: Number,
            default: new Date().getTime(),
        },
    },
    {
        strict: true,
        collection: "GoodsQuotationRequest",
        versionKey: false,
        timestamps: true,
    }
);

const GoodsQuotationRequestModel = mongoose.model("GoodsQuotationRequest", goodsQuotationRequestSchema);
export default GoodsQuotationRequestModel;
