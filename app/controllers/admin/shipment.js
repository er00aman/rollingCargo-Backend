import * as commonService from "../../services/common/common.service";
import { success, error } from '../../responses/messages'
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response'; import GoodsCategoryModel from "./../../models/admin/goodsCategory.model";
import HttpStatus from 'http-status-codes'
import OrderModel from '../../models/user/order.model'
import ReviewModel from "../../models/user/review.model";
import { sendEmail } from "../../utils/sendGrid";
import GoodsQuotationRequestModel from "../../models/admin/goodsQuotationRequest.model";
import moment from 'moment';



export const getPlacedOrders = async (req, res) => {
    try {
        console.log("Fetching pending orders...");

        const condition = { status: 1 };
        const projection = {};
        const populate = [
            { path: 'userId', select: 'name phoneNumber email countryCode' },
            { path: 'goodsType', select: 'name' }
        ];
        const sort = { createdAt: -1 };

        const orders = await commonService.findListWithPopulateWithoutKey(OrderModel, condition, projection, populate, sort);

        if (!orders || !orders.length) {
            return sendErrorResponse(res, 'No orders with status pending found', HttpStatus.NOT_FOUND);
        }
        // console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", orders)

        const formattedOrders = orders.map(order => ({
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            orderTime: new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
            shippingMode: order.shippingMode,
            sendingCountry: order.sendingCountry,
            sendingCity: order.sendingCity,
            receivingCountry: order.receivingCountry,
            receivingCity: order.receivingCity,
            cargoInformation: {
                cargoType: order.goodsType ? order.goodsType.name : 'Unknown',
                length: order.goodsLength,
                height: order.goodsHeight,
                width: order.goodsWidth,
                weight: order.goodsWeight,
                goodsDescription: order.goodsDescription,
                volume: order.goodsVolume ? order.goodsVolume : null,

            },
            status: order.status,
            receiverDetails: {
                name: order.receiverName,
                mobile: order.receiverMobileNo,
                email: order.receiverEmail ? order.receiverEmail : null,
                address: order.receiverAddress
            },
            userDetails: {
                name: order.userId.name,
                mobile: `${order.userId.countryCode}${order.userId.phoneNumber}`,
                email: order.userId.email
            },
            totalAmount: order.totalAmount
        }));

        return sendSuccessResponse(res, formattedOrders, success.LIST_FETCH, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};




export const getAllOngoingOrder = async (req, res) => {
    try {
        console.log("Fetching ongoing orders...");

        const condition = { status: 2 };
        const projection = {}
        const populate = [
            { path: 'userId', select: 'name phoneNumber email countryCode' },
            { path: 'goodsType', select: 'name' },

        ];
        const sort = { createdAt: -1 };

        const ongoingOrders = await commonService.findListWithPopulateWithoutKey(OrderModel, condition, projection, populate, sort);

        if (!ongoingOrders || !ongoingOrders.length) {
            return sendErrorResponse(res, 'No ongoing orders found', HttpStatus.NOT_FOUND);
        }

        const formattedOngoingOrders = ongoingOrders.map(order => ({
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            orderTime: new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
            shippingMode: order.shippingMode,
            sendingCountry: order.sendingCountry,
            sendingCity: order.sendingCity,
            receivingCountry: order.receivingCountry,
            receivingCity: order.receivingCity,
            cargoInformation: {
                cargoType: order.goodsType ? order.goodsType.name : 'Unknown',
                length: order.goodsLength,
                height: order.goodsHeight,
                width: order.goodsWidth,
                weight: order.goodsWeight,
                goodsDescription: order.goodsDescription,

                volume: order.goodsVolume ? order.goodsVolume : null,
            },
            status: order.status,
            receiverDetails: {
                name: order.receiverName,
                mobile: order.receiverMobileNo,
                address: order.receiverAddress,
                email: order.receiverEmail ? order.receiverEmail : null,
            },
            userDetails: {
                name: order.userId.name,
                mobile: `${order.userId.countryCode}${order.userId.phoneNumber}`,
                email: order.userId.email
            },

            totalAmount: order.totalAmount,
            landingNumber: order.landingNumber ? order.landingNumber : null,
        }));

        return sendSuccessResponse(res, formattedOngoingOrders, 'Ongoing orders fetched successfully', HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};



export const getAllPastOrder = async (req, res) => {
    try {
        console.log("Fetching past (delivered) orders...");

        const condition = { status: { $in: [4, 8] } };
        const projection = {};
        const populate = [
            { path: 'userId', select: 'name phoneNumber email countryCode ' },
            { path: 'goodsType', select: 'name' },
            { path: 'reviews', select: 'rating comment' }
        ];
        const sort = { createdAt: -1 };

        const pastOrders = await commonService.findListWithPopulateWithoutKey(OrderModel, condition, projection, populate, sort);

        if (!pastOrders || !pastOrders.length) {
            return sendErrorResponse(res, 'No past orders found', HttpStatus.NOT_FOUND);
        }

        const formattedPastOrders = pastOrders.map(order => ({
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            orderTime: new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
            shippingMode: order.shippingMode,
            sendingCountry: order.sendingCountry,
            sendingCity: order.sendingCity,
            receivingCountry: order.receivingCountry,
            receivingCity: order.receivingCity,
            cargoInformation: {
                cargoType: order.goodsType ? order.goodsType.name : 'Unknown',
                length: order.goodsLength,
                height: order.goodsHeight,
                width: order.goodsWidth,
                weight: order.goodsWeight,
                goodsDescription: order.goodsDescription,
                volume: order.goodsVolume ? order.goodsVolume : null,
            },
            status: order.status,
            receiverDetails: {
                name: order.receiverName,
                mobile: order.receiverMobileNo,
                address: order.receiverAddress,
                email: order.receiverEmail ? order.receiverEmail : null,
            },
            userDetails: {
                name: order.userId.name,
                mobile: `${order.userId.countryCode}${order.userId.phoneNumber}`,
                email: order.userId.email
            },
            reviews: order.reviews ? order.reviews.map(review => ({
                rating: review.rating,
                comment: review.comment,

            })) : [],
            totalAmount: order.totalAmount,
            landingNumber: order.landingNumber ? order.landingNumber : null,
        }));

        return sendSuccessResponse(res, formattedPastOrders, 'Past orders fetched successfully', HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};


export const addLandingNoAndSend = async (req, res) => {
    try {
        const { orderId } = req.query;


        if (!orderId) {
            return sendErrorResponse(res, 'Order ID is required', HttpStatus.BAD_REQUEST);
        }


        const { landingNumber } = req.body;


        if (!landingNumber) {
            return sendErrorResponse(res, 'Landing number is required', HttpStatus.BAD_REQUEST);
        }

        const currentTime = new Date().getTime();

        const profile = {
            status: 2,
            landingNumber,
            shippingOn: currentTime,
            modifiedAt: currentTime
            // updatedAt: new Date().getTime()
        };


        const updatedOrder = await commonService.findOneAndUpdateWithOtherKey(
            OrderModel,
            { orderId: orderId, status: 1 },
            profile
        );


        if (!updatedOrder) {
            return sendErrorResponse(res, 'Order not found or already processed', HttpStatus.NOT_FOUND);
        }


        return sendSuccessResponse(res, updatedOrder, 'Landing number added and sent for ongoing process', HttpStatus.OK);

    } catch (err) {

        return sendErrorResponse(res, err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};




// ...................Reciver Side .........................  

export const getAllOngoingOrderForReceiver = async (req, res) => {
    try {
        const condition = { status: { $in: [2, 3] } };;
        const sort = { createdAt: -1 };


        const populate = [
            { path: 'userId', select: 'name phoneNumber email countryCode' },
            { path: 'goodsType', select: 'name' }
        ];

        const OngoingOrders = await commonService.findListWithPopulateWithoutKey(
            OrderModel,
            condition,
            {},
            populate,
            sort
        );

        if (!OngoingOrders || !OngoingOrders.length) {
            return sendErrorResponse(res, 'No ongoing orders found', HttpStatus.NOT_FOUND);
        }

        // Format the orders
        const formattedOrders = OngoingOrders.map(order => ({
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            orderTime: new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
            shippingMode: order.shippingMode,
            sendingCountry: order.sendingCountry,
            sendingCity: order.sendingCity,
            receivingCountry: order.receivingCountry,
            receivingCity: order.receivingCity,
            cargoInformation: {
                cargoType: order.goodsType ? order.goodsType.name : 'N/A',
                length: order.goodsLength,
                height: order.goodsHeight,
                width: order.goodsWidth,
                weight: order.goodsWeight,
                volume: order.goodsVolume ? order.goodsVolume : null,
                description: order.goodsDescription,

            },
            status: order.status,
            receiverDetails: {
                name: order.receiverName,
                mobile: order.receiverMobileNo,
                address: order.receiverAddress,
                email: order.receiverEmail ? order.receiverEmail : null,
            },
            userDetails: {
                name: order.userId.name,
                mobile: `${order.userId.countryCode}${order.userId.phoneNumber}`,
                email: order.userId.email
            },
            landingNumber: order.landingNumber ? order.landingNumber : null,
            totalAmount: order.totalAmount
        }));

        return sendSuccessResponse(res, formattedOrders, 'Ongoing Orders fetched successfully', HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};




export const markOrderAsReceived = async (req, res) => {
    try {
        const { orderId, landingNumber } = req.body;

        if (!orderId) {
            return sendErrorResponse(res, 'Order ID is required', HttpStatus.BAD_REQUEST);
        }
        if (!landingNumber) {
            return sendErrorResponse(res, 'Landing number is required', HttpStatus.BAD_REQUEST);
        }


        const order = await commonService.findOne(OrderModel, { orderId: orderId, landingNumber: landingNumber });

        if (!order) {
            return sendErrorResponse(res, 'Order not found', HttpStatus.NOT_FOUND);
        }


        if (order.status === 3) {
            return sendSuccessResponse(res, order, 'Order already marked as received', HttpStatus.OK);
        }

        const currentTime = new Date().getTime();


        if (order.status === 2) {
            const updateData = {
                status: 3,  // Mark as received

                orderReceive: currentTime,
                // modifiedAt: currentTime
                // updatedAt: new Date().getTime()
            };

            const updatedOrder = await commonService.findOneAndUpdateWithOtherKey(OrderModel, { orderId: orderId, landingNumber: landingNumber }, updateData);

            return sendSuccessResponse(res, updatedOrder, 'Order marked as received successfully', HttpStatus.OK);
        }


        return sendErrorResponse(res, 'Order cannot be marked as received', HttpStatus.BAD_REQUEST);

    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};




export const getAllPickupOngoingOrder = async (req, res) => {
    try {
        console.log("Fetching ongoing pickup orders...");

        const condition = { status: 3 };
        const projection = {};
        const populate = [
            { path: 'userId', select: 'name phoneNumber email countryCode' },
            { path: 'goodsType', select: 'name' }
        ];
        const sort = { createdAt: -1 };

        const ongoingOrders = await commonService.findListWithPopulateWithoutKey(OrderModel, condition, projection, populate, sort);

        if (!ongoingOrders || !ongoingOrders.length) {
            return sendErrorResponse(res, 'No ongoing pickup orders found', HttpStatus.NOT_FOUND);
        }

        const formattedPickupOrders = ongoingOrders.map(order => ({
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            orderTime: new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
            shippingMode: order.shippingMode,
            sendingCountry: order.sendingCountry,
            sendingCity: order.sendingCity,
            receivingCountry: order.receivingCountry,
            receivingCity: order.receivingCity,
            cargoInformation: {
                cargoType: order.goodsType ? order.goodsType.name : 'N/A',  // Check if goodsType exists
                length: order.goodsLength,
                height: order.goodsHeight,
                width: order.goodsWidth,
                weight: order.goodsWeight,
                goodsDescription: order.goodsDescription,
                volume: order.goodsVolume ? order.goodsVolume : null,
            },
            status: order.status,
            receiverDetails: {
                name: order.receiverName,
                mobile: order.receiverMobileNo,
                address: order.receiverAddress,
                email: order.receiverEmail ? order.receiverEmail : null,
            },
            userDetails: {
                name: order.userId.name,
                mobile: `${order.userId.countryCode}${order.userId.phoneNumber}`,
                email: order.userId.email
            },
            totalAmount: order.totalAmount,
            landingNumber: order.landingNumber ? order.landingNumber : null,

        }));

        return sendSuccessResponse(res, formattedPickupOrders, 'Pickup ongoing orders fetched successfully', HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const markOrderAsPicked = async (req, res) => {
    try {
        const { orderId, landingNumber } = req.body;

        if (!orderId) {
            return sendErrorResponse(res, 'Order ID is required', HttpStatus.BAD_REQUEST);
        }
        if (!landingNumber) {
            return sendErrorResponse(res, 'Landing number is required', HttpStatus.BAD_REQUEST);
        }


        const order = await commonService.findOne(OrderModel, { orderId: orderId, landingNumber: landingNumber });

        if (!order) {
            return sendErrorResponse(res, 'Order not found', HttpStatus.NOT_FOUND);
        }


        if (order.status === 4) {
            return sendSuccessResponse(res, order, 'Order already picked up ', HttpStatus.OK);
        }
        const currentTime = new Date().getTime();

        if (order.status === 3) {
            const updateData = {
                status: 4,
                orderPickedUp: currentTime,
                // modifiedAt: currentTime
                // updatedAt: new Date().getTime()
            };

            const updatedOrder = await commonService.findOneAndUpdateWithOtherKey(OrderModel, { orderId: orderId, landingNumber: landingNumber }, updateData);

            return sendSuccessResponse(res, updatedOrder, "order marked as pickup successfully", HttpStatus.OK);
        }


        return sendErrorResponse(res, 'Order cannot be marked as received', HttpStatus.BAD_REQUEST);

    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};




export const getAllPickedUpPastOrder = async (req, res) => {
    try {
        console.log("Fetching picked up past orders...");

        const condition = { status: 4 };
        const projection = {};
        const populate = [
            { path: 'userId', select: 'name phoneNumber email countryCode' },
            { path: 'goodsType', select: 'name' },
            { path: 'reviews', select: 'rating comment' }
        ];
        const sort = { createdAt: -1 };

        const deliveredOrders = await commonService.findListWithPopulateWithoutKey(OrderModel, condition, projection, populate, sort);

        if (!deliveredOrders || !deliveredOrders.length) {
            return sendErrorResponse(res, 'No past orders found', HttpStatus.NOT_FOUND);
        }

        const formattedPastOrders = deliveredOrders.map(order => ({
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            orderTime: new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
            shippingMode: order.shippingMode,
            sendingCountry: order.sendingCountry,
            sendingCity: order.sendingCity,
            receivingCountry: order.receivingCountry,
            receivingCity: order.receivingCity,
            cargoInformation: {
                cargoType: order.goodsType ? order.goodsType.name : 'N/A',
                length: order.goodsLength,
                height: order.goodsHeight,
                width: order.goodsWidth,
                weight: order.goodsWeight,
                goodsDescription: order.goodsDescription,
                volume: order.goodsVolume ? order.goodsVolume : null,
            },
            status: order.status,
            receiverDetails: {
                name: order.receiverName,
                mobile: order.receiverMobileNo,
                address: order.receiverAddress,
                email: order.receiverEmail ? order.receiverEmail : null,
            },
            userDetails: {
                name: order.userId.name,
                mobile: `${order.userId.countryCode}${order.userId.phoneNumber}`,
                email: order.userId.email
            },

            totalAmount: order.totalAmount,
            reviews: order.reviews ? order.reviews.map(review => ({
                rating: review.rating ? review.rating : 'N/A',
                comment: review.comment ? review.rating : 'N/A',

            })) : [],
            landingNumber: order.landingNumber ? order.landingNumber : null,
        }));

        return sendSuccessResponse(res, formattedPastOrders, 'Picked up past orders fetched successfully', HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const getAllDeliverPastOrder = async (req, res) => {
    try {
        console.log("Fetching picked up past orders...");

        const condition = { status: 8 };
        const projection = {};
        const populate = [
            { path: 'userId', select: 'name phoneNumber email countryCode' },
            { path: 'goodsType', select: 'name' },
            { path: 'reviews', select: 'rating comment' }
        ];
        const sort = { createdAt: -1 };

        const deliveredOrders = await commonService.findListWithPopulateWithoutKey(OrderModel, condition, projection, populate, sort);
        // console.log("nnnnnnnnnnn", deliveredOrders)

        if (!deliveredOrders || !deliveredOrders.length) {
            return sendErrorResponse(res, 'No past deliver  orders found', HttpStatus.NOT_FOUND);
        }

        const formattedPastOrders = deliveredOrders.map(order => ({
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            orderTime: new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
            shippingMode: order.shippingMode,
            sendingCountry: order.sendingCountry,
            sendingCity: order.sendingCity,
            receivingCountry: order.receivingCountry,
            receivingCity: order.receivingCity,
            cargoInformation: {
                cargoType: order.goodsType ? order.goodsType.name : 'N/A',
                length: order.goodsLength,
                height: order.goodsHeight,
                width: order.goodsWidth,
                weight: order.goodsWeight,
                goodsDescription: order.goodsDescription,
                volume: order.goodsVolume ? order.goodsVolume : null,
            },
            status: order.status,
            receiverDetails: {
                name: order.receiverName,
                mobile: order.receiverMobileNo,
                address: order.receiverAddress,
                email: order.receiverEmail ? order.receiverEmail : null,
            },
            userDetails: {
                name: order.userId.name,
                mobile: `${order.userId.countryCode}${order.userId.phoneNumber}`,
                email: order.userId.email
            },
            reviews: order.reviews ? order.reviews.map(review => ({
                rating: review.rating ? review.rating : 'N/A',
                comment: review.comment ? review.rating : 'N/A',

            })) : [],
            totalAmount: order.totalAmount,
            landingNumber: order.landingNumber ? order.landingNumber : null,
        }));
        // console.log("vvvvvvvvvvvvvvvvv", formattedPastOrders)

        return sendSuccessResponse(res, formattedPastOrders, 'deliver past order fetch successfully', HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};


export const getAllDeliverOngoingOrder = async (req, res) => {
    try {
        console.log("Fetching ongoing pickup orders...");

        const condition = { deliveryType: 2 };
        const projection = {};
        const populate = [
            { path: 'userId', select: 'name phoneNumber email countryCode' },
            { path: 'goodsType', select: 'name' }
        ];
        const sort = { createdAt: -1 };

        const ongoingOrders = await commonService.findListWithPopulateWithoutKey(OrderModel, condition, projection, populate, sort);

        if (!ongoingOrders || !ongoingOrders.length) {
            return sendErrorResponse(res, 'No ongoing pickup orders found', HttpStatus.NOT_FOUND);
        }

        const formattedPickupOrders = ongoingOrders.map(order => ({
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
            orderTime: new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
            shippingMode: order.shippingMode,
            sendingCountry: order.sendingCountry,
            sendingCity: order.sendingCity,
            receivingCountry: order.receivingCountry,
            receivingCity: order.receivingCity,
            cargoInformation: {
                cargoType: order.goodsType ? order.goodsType.name : 'N/A',  // Check if goodsType exists
                length: order.goodsLength,
                height: order.goodsHeight,
                width: order.goodsWidth,
                weight: order.goodsWeight,
                goodsDescription: order.goodsDescription,
                volume: order.goodsVolume ? order.goodsVolume : null,
            },
            status: order.status,
            receiverDetails: {
                name: order.receiverName,
                mobile: order.receiverMobileNo,
                address: order.receiverAddress,
                email: order.receiverEmail ? order.receiverEmail : null,
            },
            userDetails: {
                name: order.userId.name,
                mobile: `${order.userId.countryCode}${order.userId.phoneNumber}`,
                email: order.userId.email
            },
            totalAmount: order.totalAmount,
            landingNumber: order.landingNumber ? order.landingNumber : null,

        }));

        return sendSuccessResponse(res, formattedPickupOrders, 'Pickup ongoing orders fetched successfully', HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};


export const markOrderAsDelivered = async (req, res) => {
    try {
        const { orderId, landingNumber } = req.body;

        if (!orderId) {
            return sendErrorResponse(res, 'Order ID is required', HttpStatus.BAD_REQUEST);
        }
        if (!landingNumber) {
            return sendErrorResponse(res, 'Landing number is required', HttpStatus.BAD_REQUEST);
        }


        const order = await commonService.findOne(OrderModel, { orderId: orderId, landingNumber: landingNumber });

        if (!order) {
            return sendErrorResponse(res, 'Order not found', HttpStatus.NOT_FOUND);
        }


        if (order.status === 8) {
            return sendSuccessResponse(res, order, 'Order already delivered', HttpStatus.OK);
        }

        const currentTime = new Date().getTime();


        if (order.status === 7) {
            const updateData = {
                status: 8,
                deliveredOn: currentTime,
                // modifiedAt: currentTime,
                // updatedAt: new Date().getTime()
            };

            const updatedOrder = await commonService.findOneAndUpdateWithOtherKey(OrderModel, { orderId: orderId, landingNumber: landingNumber }, updateData);

            return sendSuccessResponse(res, updatedOrder, 'Order marked as received successfully', HttpStatus.OK);
        }


        return sendErrorResponse(res, 'Order delivered successfully', HttpStatus.BAD_REQUEST);

    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};



// ------------Quotation ----------------------------




export const getNewQuotationRequests = async (req, res) => {

    try {





        const condition = { status: 0, isDeleted: { $ne: true } };
        const projection = {};
        const populate = { path: 'goodsType', select: 'name' }
        const sort = { requestedAt: -1 };

        let pendingRequests = await commonService.findListWithPopulateWithoutKey(GoodsQuotationRequestModel, condition, projection, populate, sort)


        if (!pendingRequests.length) {
            return sendSuccessResponse(res, [], 'No pending requests found', HttpStatus.OK);
        }
        const formattedRequests = pendingRequests.map((request) => {
            return {
                requestId: request.requestId,
                requestedDate: moment(request.requestedAt).format('DD/MM/YY'),
                requestedTime: moment(request.requestedAt).format('HH:mm'),
                shippingMode: request.shippingMode,
                sendingFrom: {
                    country: request.sendingCountry,
                    city: request.sendingCity,
                },
                sendingTo: {
                    country: request.receivingCountry,
                    city: request.receivingCity,
                },
                goodsInformation: {
                    goodsType: request.goodsType ? request.goodsType.name : 'N/A',
                    goodsWeight: request.goodsWeight,
                    goodsDescription: request.goodsDescription || 'N/A',
                    length: request.goodsLength ? request.goodsLength : null,
                    width: request.goodsWidth ? request.goodsWidth : null,
                    height: request.goodsHeight ? request.goodsHeight : null,
                    volume: request.goodsVolume ? request.goodsVolume : null,

                },
                receiverDetails: {
                    receiverName: request.receiverName || 'N/A',
                    receiverPhoneNumber: request.receiverMobileNo || 'N/A',
                    receiverAddress: request.receiverAddress || 'N/A',
                },
                systemCalculatedPrice: request.shippingPrice ? request.shippingPrice : 'Request For Price',
                isRepackaging: request.isRepackaging ? request.isRepackaging : 0,
            };
        });


        return sendSuccessResponse(res, formattedRequests, 'Pending requests retrieved successfully', HttpStatus.OK);
    } catch (err) {

        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};


export const updateQuotationPrices = async (req, res) => {
    try {
        const { requestId, shippingPrice, repackagePrice, taxAmount } = req.body;



        let request = await GoodsQuotationRequestModel.findOne({ requestId: requestId, status: 0 })

        // console.log("hhhhhhhhhhh", request)


        if (!request) {
            return sendSuccessResponse(res, {}, 'Quotation request not found or already processed', HttpStatus.OK);
            // return sendErrorResponse(res, 'Quotation request not found or already processed', HttpStatus.NOT_FOUND);
        }


        if (request.isRepackaging && request.shippingPrice && request.taxAmount) {
            if (!repackagePrice) {
                return sendErrorResponse(res, 'Repackaging price is required', HttpStatus.BAD_REQUEST);
            }
            request.repackagePrice = repackagePrice;
        }


        else if (!request.isRepackaging && !request.shippingPrice) {
            if (!shippingPrice) {
                return sendErrorResponse(res, 'Shipping price is required', HttpStatus.BAD_REQUEST);
            }
            request.shippingPrice = shippingPrice;
            request.taxAmount = taxAmount
        }


        else if (request.isRepackaging && !request.shippingPrice) {
            if (!shippingPrice || !repackagePrice) {
                return sendErrorResponse(res, 'Both shipping price and repackaging price are required', HttpStatus.BAD_REQUEST);
            }
            request.shippingPrice = shippingPrice;
            request.repackagePrice = repackagePrice;
            request.taxAmount = taxAmount;
        }


        request.status = 1;
        request.updatedAt = new Date().getTime();


        await request.save();

        return sendSuccessResponse(res, {}, 'Quotation request updated successfully', HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};


export const getQuotationRequestsWithPrices = async (req, res) => {
    try {

        const condition = { status: 1, isDeleted: { $ne: true } };
        const projection = {};
        const populate = { path: 'goodsType', select: 'name' }

        const sort = { requestedAt: -1 };

        const completedRequests = await commonService.findListWithPopulateWithoutKey(GoodsQuotationRequestModel, condition, projection, populate, sort);



        console.log("Fetched requests with status 1:", completedRequests);


        if (!completedRequests.length) {
            return sendSuccessResponse(res, [], 'No completed requests found', HttpStatus.OK);
        }


        const formattedRequests = completedRequests.map((request) => {
            return {
                requestId: request.requestId,
                requestedDate: moment(request.requestedAt).format('DD/MM/YY'),
                requestedTime: moment(request.requestedAt).format('HH:mm'),
                shippingMode: request.shippingMode,
                sendingFrom: {
                    country: request.sendingCountry,
                    city: request.sendingCity,
                },
                sendingTo: {
                    country: request.receivingCountry,
                    city: request.receivingCity,
                },
                goodsInformation: {
                    goodsType: request.goodsType ? request.goodsType.name : 'unknown',
                    goodsWeight: request.goodsWeight,
                    goodsDescription: request.goodsDescription || 'N/A',
                    length: request.goodsLength ? request.goodsLength : null,
                    width: request.goodsWidth ? request.goodsWidth : null,
                    height: request.goodsHeight ? request.goodsHeight : null,
                    volume: request.goodsVolume ? request.goodsVolume : null,
                },
                receiverDetails: {
                    receiverName: request.receiverName || 'N/A',
                    receiverPhoneNumber: request.receiverMobileNo || 'N/A',
                    receiverAddress: request.receiverAddress || 'N/A',
                },
                systemCalculatedPrice: {
                    shippingPrice: request.shippingPrice ? request.shippingPrice : 'N/A',
                    repackagingPrice: request.isRepackaging ? (request.repackagePrice || 'N/A') : 'Not Required'
                },
                isRepackaging: request.isRepackaging ? 'Yes' : 'No'
            };
        });


        return sendSuccessResponse(res, formattedRequests, 'Completed requests retrieved successfully', HttpStatus.OK);
    } catch (err) {

        return sendErrorResponse(res, err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};


export const getRejectedQuotationRequest = async (req, res) => {

    // console.log("uuuuuuuuuuuuuuuuuu")
    try {

        const condition = { status: 2, isDeleted: { $ne: true } };
        const projection = {};
        const sort = { requestedAt: -1 };
        const populate = { path: 'goodsType', select: 'name' }

        const status2Requests = await commonService.findListWithPopulateWithoutKey(GoodsQuotationRequestModel, condition, projection, populate, sort);
        // console.log("kkk", status2Requests)


        console.log("Fetched requests with status 2:", status2Requests);

        if (!status2Requests || status2Requests.length === 0) {
            return sendSuccessResponse(res, [], 'No requests found with status 2', HttpStatus.OK);
        }


        const formattedRequests = status2Requests.map((request) => {
            return {
                requestId: request.requestId,
                requestedDate: moment(request.requestedAt).format('DD/MM/YY'),
                requestedTime: moment(request.requestedAt).format('HH:mm'),
                shippingMode: request.shippingMode,
                sendingFrom: {
                    country: request.sendingCountry,
                    city: request.sendingCity,
                },
                sendingTo: {
                    country: request.receivingCountry,
                    city: request.receivingCity,
                },
                goodsInformation: {
                    goodsType: request.goodsType ? request.goodsType.name : 'N/A',
                    goodsWeight: request.goodsWeight,
                    goodsDescription: request.goodsDescription || 'N/A',
                    length: request.goodsLength ? request.goodsLength : null,
                    width: request.goodsWidth ? request.goodsWidth : null,
                    height: request.goodsHeight ? request.goodsHeight : null,
                    volume: request.goodsVolume ? request.goodsVolume : null,
                },
                receiverDetails: {
                    receiverName: request.receiverName || 'N/A',
                    receiverPhoneNumber: request.receiverMobileNo || 'N/A',
                    receiverAddress: request.receiverAddress || 'N/A',
                },


            };
        });


        return sendSuccessResponse(res, formattedRequests, 'Requests with status 2 retrieved successfully', HttpStatus.OK);
    } catch (err) {

        return sendErrorResponse(res, err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};


export const getQuotationRequestAndUpdateStatus = async (req, res) => {
    try {
        const { requestId } = req.body;


        const updateFields = {
            status: 2,
            updatedAt: new Date().getTime()
        };


        const updatedRequest = await commonService.findOneAndUpdateWithOtherKey(GoodsQuotationRequestModel, { requestId, isDeleted: { $ne: true } }, updateFields);


        if (!updatedRequest) {
            return sendErrorResponse(res, 'Quotation request not found or could not be rejected ', HttpStatus.NOT_FOUND);
        }


        return sendSuccessResponse(res, {
            requestId: updatedRequest.requestId,
            updatedStatus: updatedRequest.status,
            updatedAt: updatedRequest.updatedAt
        }, 'Quotation request rejected  successfully', HttpStatus.OK);

    } catch (err) {

        return sendErrorResponse(res, err.message || 'Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
};




// -----
















