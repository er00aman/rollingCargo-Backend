import mongoose from "mongoose";
import generateUniqueId from 'generate-unique-id';

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        orderId: {
            type: String,
            default: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase())
        },
        reviews: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null },
        orderType: {
            type: Number,
            default: 1,  // 1 shipment, 2 for smallGoods, 3 for largeGoods, 4 for export
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
            required: true
        },
        couponId: {
            type: mongoose.Types.ObjectId,
            ref: "Coupon",
            // default: ""
            default: null,
        },
        goodsType: {
            type: mongoose.Types.ObjectId,
            ref: "GoodsCategory",
            // default: "",
            default: null
        },
        goodsWeight: {
            type: Number,
            default: null
        },
        goodsVolume: {
            type: Number,
            default: null,
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
        receiverEmail: {
            type: String,
            default: ""
        },
        receiverMobileNo: {
            type: String,
            default: ""
        },
        receiverAddress: {
            houseBuilding: {
                type: String,
                default: ""
            },
            street: {
                type: String,
                default: ""
            },
            area: {
                type: String,
                default: ""
            },
            city: {
                type: String,
                default: ""
            },
            zipCode: {
                type: String,
                default: ""
            },
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        taxAmount: {
            type: Number,
            default: 0
        },
        discountAmount: {
            type: Number,
            default: 0
        },
        repackagePrice: {
            type: Number,
            default: 0
        },
        shippingPrice: {
            type: Number,
            default: 0
        },
        deliveryType: {
            type: Number,
            default: 0,//1-pickup,2-deliver
        },
        isRepackaging: {
            type: Number,
            default: 0 // 0 for no,1 for yes
        },
        goodsLength: {
            type: Number,
            default: null
        },
        goodsWidth: {
            type: Number,
            default: null
        },
        goodsHeight: {
            type: Number,
            default: null
        },
        transactionId: {
            type: String,
            default: ''
        },
        paymentOptions: {
            type: String,
            enum: ['COD', 'CARD'],
            default: 'CARD'
        },
        cancelReason: {
            type: String,
            default: ""
        },
        status: {
            type: Number,
            // default: 0 // 0- pending, 1- orderPlaced,2- shippingOn, 3- outForShippingOn, 4- packedOn, 5- outForDeliveryOn, 6- deliveredOn, 7-cancelledOn
            default: 0 //0- pending, 1- orderPlaced, 2- shippingOn, 3-orderReceive, 4-orderPickedUp, 5- outForShippingOn, 6- packedOn, 7- outForDeliveryOn, 8- deliveredOn, - 9cancelledOn  
        },
        wareHouseId: {
            type: mongoose.Types.ObjectId,
            ref: "WareHouse",
            default: null
        },
        goodsQuotationRequest: {
            type: mongoose.Types.ObjectId,
            ref: "GoodsQuotationRequest",
            default: null
        },
        paymentResponse: [],
        isRefunded: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Number,
            default: new Date().getTime(),
        },
        shippingOn: {
            type: Number,
        },
        orderReceive: {
            type: Number
        },
        outForShippingOn: {
            type: Number,
        },
        orderPickedUp: {
            type: Number
        },
        packedOn: {
            type: Number,
        },
        outForDeliveryOn: {
            type: Number,
        },
        deliveredOn: {
            type: Number,
        },
        cancelledOn: {
            type: Number,
        },
        modifiedAt: {
            type: Number,
        },
        cancelledOn: {
            type: Number,
        },
        landingNumber: {
            type: String,
        }
    },
    {
        strict: true,
        collection: "Order",
        versionKey: false,
        timestamps: true,
    }
);

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
