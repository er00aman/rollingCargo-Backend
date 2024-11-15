import HttpStatus from 'http-status-codes'
import * as commonService from '../../services/common/common.service';
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response'
import { success, error } from '../../responses/messages'
import UserModel from '../../models/user/user.model';
import generateUniqueId from 'generate-unique-id';
import BannerModel from '../../models/admin/banner.model';
import CouponModel from '../../models/admin/coupon.model';
import GoodsCategoryModel from '../../models/admin/goodsCategory.model';
import DeliveryChargeModel from '../../models/admin/deliveryCharge.model';
import GoodsQuotationRequestModel from '../../models/admin/goodsQuotationRequest.model';
// import OrderModel from '../../models/user/order.model';
import ReviewModel from '../../models/user/review.model';

import OrderModel from '../../models/user/order.model';
import WareHouseModel from '../../models/admin/warehouse.model';

/****************************************
*************** SPRINT 2 ****************
*****************************************/

export const getBannerList = async (req, res) => {
    try {

        const userData = await commonService.getAllByConditionFields(BannerModel, { isDeleted: false, isBlocked: false }, { isDeleted: 0, isBlocked: 0 }, { _id: -1 })
        if (userData) {
            let sendData = [];
            if (userData.length > 0) {
                for (let i = 0; i < userData.length; i++) {
                    let today = new Date().getTime();
                    let duration = Number(userData[i].duration);
                    let expireDate = (Number(userData[i].createdAt) + (duration * 86400000));
                    if (today < expireDate) {
                        sendData.push(userData[i])
                    }
                }
            }
            return sendSuccessResponse(res, sendData, success.LIST_FETCH, HttpStatus.OK)
        } else {
            return sendErrorResponse(res, error.DEFAULT_ERROR, HttpStatus.BAD_REQUEST);
        }
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
}

export const getCouponList = async (req, res) => {
    try {

        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk")
        let today = new Date().getTime();

        let findData = {
            isDeleted: false,
            isBlocked: false,
            $and: [{ validFrom: { $lte: today } }, { validTill: { $gte: today } }]
        }
        const userData = await commonService.getAllByConditionFields(CouponModel, findData, { isDeleted: 0, isBlocked: 0 }, { _id: -1 })
        if (userData) {
            return sendSuccessResponse(res, userData, success.LIST_FETCH, HttpStatus.OK)
        } else {
            return sendErrorResponse(res, error.DEFAULT_ERROR, HttpStatus.BAD_REQUEST);
        }
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
}

export const getGoodsCategoryList = async (req, res) => {
    try {

        const userData = await commonService.getAllByConditionFields(GoodsCategoryModel, { isDeleted: false, isBlocked: false }, { isDeleted: 0, isBlocked: 0 }, { _id: -1 })
        if (userData) {
            return sendSuccessResponse(res, userData, success.LIST_FETCH, HttpStatus.OK)
        } else {
            return sendErrorResponse(res, error.DEFAULT_ERROR, HttpStatus.BAD_REQUEST);
        }
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
}

export const getDeliveryChargesList = async (req, res) => {
    try {
        let { country } = req.body;
        const userData = await commonService.getByConditionFields(DeliveryChargeModel, { isDeleted: false, isBlocked: false, country: country }, { isDeleted: 0, isBlocked: 0 })
        if (userData) {
            return sendSuccessResponse(res, userData, success.DETAILS_FETCH, HttpStatus.OK)
        } else {
            let defaultData = {
                country: country,
                airFreight: {
                    perKgCharge: 0,
                    handlingCharge: 0,
                    minimumWeight: 0
                },
                seaFreight: {
                    perKgCharge: 0,
                    handlingCharge: 0,
                    minimumWeight: 0
                },
                taxPercent: 0,
                createdAt: 1724398559193,
                updatedAt: 1724398559193
            }
            return sendSuccessResponse(res, defaultData, success.DETAILS_FETCH, HttpStatus.OK);
        }
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
}

export const applyCoupon = async (req, res) => {
    try {
        let { amount, couponCode } = req.body;
        let today = new Date().getTime();
        let findData = {
            isDeleted: false,
            isBlocked: false,
            couponCode: couponCode,
            $and: [{ validFrom: { $lte: today } }, { validTill: { $gte: today } }]
        }
        const activeCoupon = await commonService.getByConditionFields(CouponModel, findData, { isDeleted: 0, isBlocked: 0 })
        if (!activeCoupon) {
            return sendErrorResponse(res, "Coupon does not exist or coupon expired", HttpStatus.BAD_REQUEST);
        }
        if (today > activeCoupon.validTill) {
            return sendErrorResponse(res, "Coupon expired", HttpStatus.BAD_REQUEST);
        }
        // let NoOfcouponUsed = await OrderModel.count({ couponCode: activeCoupon._id }).lean();
        // if(activeCoupon.minimum_purchase_amount > amount){
        //     return { 
        //     status: 0, message: "This coupon is not applicable on purchase amount less than " + activeCoupon.minimum_purchase_amount
        //     };
        // }

        let newPrice = amount;
        let discountAmount = 0;
        if (activeCoupon.discountPercent > 0 && amount > 0) {
            discountAmount = ((activeCoupon.discountPercent * amount) / 100);
            newPrice = amount - discountAmount;
        }

        let dataToSend = {
            priceAfterDiscount: newPrice,
            discountAmount: discountAmount
        }
        return sendSuccessResponse(res, dataToSend, success.COUPON_APPLIED, HttpStatus.OK);

    } catch (err) {
        throw new Error(err.message);
    }
};

// export const calculateShipment = async (req, res) => {
//     try {
//         let { shippingMode, sendingCountry, sendingCity, receivingCountry, receivingCity, goodsType,
//             goodsWeight, goodsLength, goodsWidth, goodsHeight,
//             // receiverAddress,goodsDescription, receiverName, receiverMobileNo
//         } = req.body;

//         let { country, _id } = req.userData;
//         // if(country == null || country == ""){
//         //     return sendErrorResponse(res, "Please update country in profile to calculate shipment", HttpStatus.BAD_REQUEST);
//         // }

//         let countryList = ["Italy", "Turkey", "Netherlands", "United Kingdom", "China", "United Arab Emirates", "South Africa"];
//         if ((countryList.includes(sendingCountry)) && (receivingCountry == "Kenya")) {
//             // calculate shipment
//             let deliveryCharge = await commonService.findOne(DeliveryChargeModel, { isDeleted: false, isBlocked: false, country: sendingCountry });

//             let minmWeight = 0;
//             let newWeight = 0;
//             let perkgCharge = 0;
//             if (shippingMode == 1) {
//                 if (goodsLength && goodsWidth && goodsHeight) {
//                     newWeight = ((Number(goodsLength) * Number(goodsWidth) * Number(goodsHeight)) / 6000);
//                 }
//                 perkgCharge = deliveryCharge ? deliveryCharge?.airFreight?.perKgCharge : 0;
//                 minmWeight = deliveryCharge ? deliveryCharge?.airFreight?.minimumWeight : 0;
//             } else if (shippingMode == 2) {
//                 if (goodsLength && goodsWidth && goodsHeight) {
//                     newWeight = ((Number(goodsLength) * Number(goodsWidth) * Number(goodsHeight)) / 1000000)
//                 }
//                 perkgCharge = deliveryCharge ? deliveryCharge?.seaFreight?.perKgCharge : 0;
//                 minmWeight = deliveryCharge ? deliveryCharge?.seaFreight?.minimumWeight : 0;
//             }

//             let finalWeight = (goodsWeight && (Number(goodsWeight) >= Number(newWeight))) ? Number(goodsWeight) : Number(newWeight);

//             if (goodsWeight && goodsWeight != '') {
//                 if (Number(finalWeight) < Number(minmWeight)) {
//                     let minMessage = "Minimum weight for " + sendingCountry + " should be greater than " + minmWeight;
//                     return sendErrorResponse(res, minMessage, HttpStatus.BAD_REQUEST);
//                 }
//             }

//             console.log("goodsWeight", goodsWeight, " newWeight ", newWeight, " finalWeight ", finalWeight, " perkgCharge ", perkgCharge);
//             let weightAmount = 0;
//             if (goodsWeight) {
//                 weightAmount = (Number(goodsWeight) * Number(perkgCharge));
//             }
//             let volumeAmount = (Number(newWeight) * Number(perkgCharge));
//             let finalAmount = (Number(finalWeight) * Number(perkgCharge));

//             let dataToSend = {
//                 amountByWeight: weightAmount,
//                 amountyVolume: volumeAmount,
//                 amountToBePaid: finalAmount,
//                 taxPercent: (deliveryCharge?.taxPercent ? deliveryCharge.taxPercent : 0)
//             }
//             let message = success.SHIPMENT_CALC;

//             return sendSuccessResponse(res, dataToSend, message, HttpStatus.OK);
//         } else {
//             return sendErrorResponse(res, "Please select our listed country to calculate shipment", HttpStatus.BAD_REQUEST);
//         }
//     } catch (err) {
//         return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
//     }
// };

export const calculateShipment = async (req, res) => {
    try {
        let {
            shippingMode, sendingCountry, sendingCity, receivingCountry, receivingCity, goodsType,
            goodsWeight, goodsLength, goodsWidth, goodsHeight,
        } = req.body;

        let { country, _id } = req.userData;

        let countryList = ["Italy", "Turkey", "Netherlands", "United Kingdom", "China", "United Arab Emirates", "South Africa"];
        if ((countryList.includes(sendingCountry)) && (receivingCountry == "Kenya")) {
            // calculate shipment
            let deliveryCharge = await commonService.findOne(DeliveryChargeModel, { isDeleted: false, isBlocked: false, country: sendingCountry });

            let minmWeight = 0;
            let newWeight = 0;
            let perkgCharge = 0;
            let volume = 0; // Initialize volume variable to store product volume

            if (shippingMode == 1) { // Air Freight
                if (goodsLength && goodsWidth && goodsHeight) {
                    volume = Number(goodsLength) * Number(goodsWidth) * Number(goodsHeight); // Calculate volume
                    newWeight = volume / 6000; // Volumetric weight for air freight
                }
                perkgCharge = deliveryCharge ? deliveryCharge?.airFreight?.perKgCharge : 0;
                minmWeight = deliveryCharge ? deliveryCharge?.airFreight?.minimumWeight : 0;
            } else if (shippingMode == 2) { // Sea Freight
                if (goodsLength && goodsWidth && goodsHeight) {
                    volume = Number(goodsLength) * Number(goodsWidth) * Number(goodsHeight); // Calculate volume
                    newWeight = volume / 1000000; // Volumetric weight for sea freight
                }
                perkgCharge = deliveryCharge ? deliveryCharge?.seaFreight?.perKgCharge : 0;
                minmWeight = deliveryCharge ? deliveryCharge?.seaFreight?.minimumWeight : 0;
            }

            let finalWeight = (goodsWeight && (Number(goodsWeight) >= Number(newWeight))) ? Number(goodsWeight) : Number(newWeight);

            if (goodsWeight && goodsWeight != '') {
                if (Number(finalWeight) < Number(minmWeight)) {
                    let minMessage = "Minimum weight for " + sendingCountry + " should be greater than " + minmWeight;
                    return sendErrorResponse(res, minMessage, HttpStatus.BAD_REQUEST);
                }
            }

            console.log("goodsWeight", goodsWeight, " newWeight ", newWeight, " finalWeight ", finalWeight, " perkgCharge ", perkgCharge);
            let weightAmount = 0;
            if (goodsWeight) {
                weightAmount = (Number(goodsWeight) * Number(perkgCharge));
            }
            let volumeAmount = (Number(newWeight) * Number(perkgCharge));
            let finalAmount = (Number(finalWeight) * Number(perkgCharge));

            // Calculate tax
            let taxPercent = deliveryCharge?.taxPercent ? deliveryCharge.taxPercent : 0;
            let taxAmount = (finalAmount * taxPercent) / 100; // Calculate exact tax amount
            let totalAmount = finalAmount + taxAmount; // Add tax to the final amount

            let dataToSend = {
                volume: volume, // Include the volume of the product
                amountByWeight: weightAmount,
                amountByVolume: volumeAmount,
                amountToBePaid: finalAmount, // This is the amount before tax
                taxPercent: taxPercent,
                taxAmount: taxAmount, // Show the exact tax amount
                totalAmountToBePaid: totalAmount // Final amount including tax
            }
            let message = success.SHIPMENT_CALC;

            return sendSuccessResponse(res, dataToSend, message, HttpStatus.OK);
        } else {
            return sendErrorResponse(res, "Please select our listed country to calculate shipment", HttpStatus.BAD_REQUEST);
        }
    } catch (err) {
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};



export const checkValidCountryOrder = async (req, res) => {
    try {
        let { shippingMode, sendingCountry, sendingCity, receivingCountry, receivingCity, goodsType,
            goodsWeight, goodsLength, goodsWidth, goodsHeight,
            receiverAddress, goodsDescription, goodsImages, receiverName, receiverMobileNo
        } = req.body;
        let { country, _id } = req.userData;
        // if(country == null || country == ""){
        //     return sendErrorResponse(res, "Please update country in profile to calculate shipment", HttpStatus.BAD_REQUEST);
        // }
        let dataToSend = {}
        let message = "";
        let countryList = ["Italy", "Turkey", "Netherlands", "United Kingdom", "China", "United Arab Emirates", "South Africa"];
        if ((countryList.includes(sendingCountry)) && (receivingCountry == "Kenya")) {
            // calculate shipment
            let deliveryCharge = await commonService.findOne(DeliveryChargeModel, { isDeleted: false, isBlocked: false, country: sendingCountry });

            let minmWeight = 0;
            let newWeight = 0;
            let perkgCharge = 0;
            if (shippingMode == 1) {
                if (goodsLength && goodsWidth && goodsHeight) {
                    newWeight = ((Number(goodsLength) * Number(goodsWidth) * Number(goodsHeight)) / 6000);
                }
                perkgCharge = deliveryCharge ? deliveryCharge?.airFreight?.perKgCharge : 0;
                minmWeight = deliveryCharge ? deliveryCharge?.airFreight?.minimumWeight : 0;
            } else if (shippingMode == 2) {
                if (goodsLength && goodsWidth && goodsHeight) {
                    newWeight = ((Number(goodsLength) * Number(goodsWidth) * Number(goodsHeight)) / 1000000)
                }
                perkgCharge = deliveryCharge ? deliveryCharge?.seaFreight?.perKgCharge : 0;
                minmWeight = deliveryCharge ? deliveryCharge?.seaFreight?.minimumWeight : 0;
            }

            let finalWeight = (goodsWeight && (Number(goodsWeight) >= Number(newWeight))) ? Number(goodsWeight) : Number(newWeight);

            if (Number(finalWeight) < Number(minmWeight)) {
                let minMessage = "Minimum weight for " + sendingCountry + " should be greater than " + minmWeight;
                return sendErrorResponse(res, minMessage, HttpStatus.BAD_REQUEST);
            }

            console.log("goodsWeight", goodsWeight, " newWeight ", newWeight, " finalWeight ", finalWeight, " perkgCharge ", perkgCharge);
            let weightAmount = 0;
            if (goodsWeight) {
                weightAmount = (Number(goodsWeight) * Number(perkgCharge));
            }
            let volumeAmount = (Number(newWeight) * Number(perkgCharge));
            let finalAmount = (Number(finalWeight) * Number(perkgCharge));

            let dataToSend = {
                isValidShipment: 1,
                amountByWeight: weightAmount,
                amountyVolume: volumeAmount,
                amountToBePaid: finalAmount,
                taxPercent: (deliveryCharge?.taxPercent ? deliveryCharge.taxPercent : 0)
            }

            return sendSuccessResponse(res, dataToSend, success.VALID_SHIPPING, HttpStatus.OK);
        } else {
            let dataToSave = {
                requestingUser: _id,
                requestId: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase()),
                shippingType: 2,
                shippingMode,
                sendingCountry: sendingCountry,
                sendingCity,
                receivingCountry,
                receivingCity,
                goodsType,
                goodsWeight,
                goodsLength,
                goodsWidth,
                goodsHeight,
                requestedAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }
            if (goodsDescription && goodsDescription != "") {
                dataToSave.goodsDescription = goodsDescription;
            }
            if (goodsImages && goodsImages.length) {
                dataToSave.goodsImages = goodsImages;
            }
            if (receiverAddress && receiverAddress != "") {
                dataToSave.receiverAddress = receiverAddress;
            }
            if (receiverName && receiverName != "") {
                dataToSave.receiverName = receiverName;
            }
            if (receiverMobileNo && receiverMobileNo != "") {
                dataToSave.receiverMobileNo = receiverMobileNo;
            }
            // console.log({dataToSave});

            await commonService.create(GoodsQuotationRequestModel, dataToSave);
            message = success.QUOTATION_REQ;

            dataToSend = {
                isValidShipment: 0
            }
            return sendSuccessResponse(res, dataToSend, message, HttpStatus.OK);
        }
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const placeOrder = async (req, res) => {
    try {
        let { orderType, shippingMode, sendingCountry, sendingCity, receivingCountry, receivingCity, couponId,
            goodsType, goodsWeight, goodsDescription, goodsImages, goodsLength, goodsWidth, goodsHeight,
            receiverAddress, receiverEmail, receiverName, receiverMobileNo, totalAmount, taxAmount, goodsVolume,
            discountAmount, transactionId, paymentOptions, paymentResponse, repackagePrice, shippingPrice,
            isRepackaging, goodsQuotationRequestId,
        } = req.body;

        let { country, _id } = req.userData;
        // if (couponId && !mongoose.isValidObjectId(couponId)) {
        //     couponId = null;
        // }

        // if (goodsType && !mongoose.isValidObjectId(goodsType)) {
        //     goodsType = null;
        // }

        let dataToSave = {
            userId: _id,
            orderId: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase()),
            orderType,
            shippingMode,
            sendingCountry: sendingCountry,
            sendingCity,
            receivingCountry,
            receivingCity,
            couponId: couponId ? couponId : null,
            goodsType: goodsType ? goodsType : null,

            goodsWeight,
            goodsLength,
            goodsWidth,
            goodsHeight,
            goodsVolume,
            receiverAddress,
            receiverEmail,
            goodsDescription,
            goodsImages,
            receiverName,
            receiverMobileNo,

            totalAmount,
            taxAmount,
            discountAmount,
            repackagePrice,
            shippingPrice,
            isRepackaging,
            transactionId,
            paymentOptions,
            paymentResponse,
            status: 1,
            createdAt: new Date().getTime()
        }
        // console.log({dataToSave})
        if (goodsQuotationRequestId) {
            dataToSave.goodsQuotationRequest = goodsQuotationRequestId;
        }
        let savedData = await OrderModel.create(dataToSave);
        if (goodsQuotationRequestId) {
            await GoodsQuotationRequestModel.findOneAndUpdate({ _id: goodsQuotationRequestId }, { $set: { status: 3 } }, { new: true });
        }
        let wareHouse = await WareHouseModel.findOne({ country: receivingCountry, city: receivingCity }).lean();
        if(wareHouse){
            await OrderModel.findOneAndUpdate({ _id: savedData._id }, { wareHouseId: wareHouse._id }, { new: true });
        }
        console.log("hhhhhh", savedData)
        return sendSuccessResponse(res, savedData, success.ORDER_PLACED, HttpStatus.OK);
    } catch (err) {
        console.log("heeerrrrrrrrrr", err.message)
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const sendLargeGoods = async (req, res) => {
    try {
        let { shippingMode, sendingCountry, sendingCity, receivingCountry, receivingCity, goodsDescription,
            goodsWeight, goodsImages, receiverName, receiverMobileNo, isRepackaging
        } = req.body;
        let { _id } = req.userData;

        let dataToSave = {
            requestingUser: _id,
            requestId: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase()),
            shippingType: 3,
            shippingMode,
            sendingCountry: sendingCountry,
            sendingCity,
            receivingCountry,
            receivingCity,
            goodsWeight,
            isRepackaging,

            status: 0,
            requestedAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        }
        if (goodsDescription && goodsDescription != "") {
            dataToSave.goodsDescription = goodsDescription;
        }
        if (goodsImages && goodsImages.length) {
            dataToSave.goodsImages = goodsImages;
        }
        if (receiverName && receiverName != "") {
            dataToSave.receiverName = receiverName;
        }

        if (receiverMobileNo && receiverMobileNo != "") {
            dataToSave.receiverMobileNo = receiverMobileNo;
        }
        // console.log({dataToSave});

        let dt = await commonService.create(GoodsQuotationRequestModel, dataToSave);
        console.log("hhhhhhhh", dt)
        let message = success.QUOTATION_REQ;

        return sendSuccessResponse(res, {}, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const exportGoods = async (req, res) => {
    try {
        let { shippingMode, sendingCountry, sendingCity, receivingCountry, goodsDescription,
            goodsWeight, goodsImages, receiverName, receiverMobileNo, exportAddress, isRepackaging
        } = req.body;
        let { _id } = req.userData;

        let dataToSave = {
            requestingUser: _id,
            requestId: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase()),
            shippingType: 4,
            shippingMode,
            sendingCountry: sendingCountry,
            sendingCity,
            receivingCountry,
            exportAddress,
            goodsWeight,
            isRepackaging,
            status: 0,
            requestedAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        }
        if (goodsDescription && goodsDescription != "") {
            dataToSave.goodsDescription = goodsDescription;
        }
        if (goodsImages && goodsImages.length) {
            dataToSave.goodsImages = goodsImages;
        }
        if (receiverName && receiverName != "") {
            dataToSave.receiverName = receiverName;
        }
        if (receiverMobileNo && receiverMobileNo != "") {
            dataToSave.receiverMobileNo = receiverMobileNo;
        }
        // console.log({dataToSave});

        await commonService.create(GoodsQuotationRequestModel, dataToSave);
        let message = success.QUOTATION_REQ;

        return sendSuccessResponse(res, {}, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const createReview = async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;
        const { _id: userId } = req.userData;
        console.log(req.userData)
        const order = await OrderModel.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return sendErrorResponse(res, 'Order not found or does not belong to the user', HttpStatus.NOT_FOUND);
        }

        const reviewData = {
            reviewId: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase()),
            userId,
            orderId,
            rating,
            comment,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const newReview = await commonService.create(ReviewModel, reviewData);
        console.log("aaaaaaaaaaaaaa", newReview)
        await commonService.findOneAndUpdate(OrderModel, { _id: orderId }, { reviews: newReview._id })
        return sendSuccessResponse(res, newReview, 'Review added successfully', HttpStatus.OK);
    } catch (err) {
        console.log("nnnnnnnnnnn", err.message)
        return sendErrorResponse(res, err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const calculateShipmentRequest = async (req, res) => {
    try {
        let { shippingMode, shippingType, sendingCountry, sendingCity, receivingCountry, receivingCity, goodsType,
            goodsWeight, goodsLength, goodsWidth, goodsHeight,
            receiverAddress, goodsDescription, goodsImages, receiverName, receiverMobileNo,
            isRepackaging, calculatedAmount, taxAmount
        } = req.body;
        // console.log(req.body)
        let { country, _id } = req.userData;

        let dataToSave = {
            requestingUser: _id,
            requestId: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase()),
            shippingType,
            shippingMode,
            sendingCountry,
            sendingCity,
            receivingCountry,
            receivingCity,
            goodsType,
            goodsWeight,
            goodsLength,
            goodsWidth,
            goodsHeight,
            isRepackaging,
            status: 0,
            shippingPrice: calculatedAmount,
            taxAmount: taxAmount,
            requestedAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        }
        if (goodsDescription && goodsDescription != "") {
            dataToSave.goodsDescription = goodsDescription;
        }
        if (goodsImages && goodsImages.length) {
            dataToSave.goodsImages = goodsImages;
        }
        if (receiverAddress && receiverAddress != "") {
            dataToSave.receiverAddress = receiverAddress;
        }
        if (receiverName && receiverName != "") {
            dataToSave.receiverName = receiverName;
        }
        if (receiverMobileNo && receiverMobileNo != "") {
            dataToSave.receiverMobileNo = receiverMobileNo;
        }
        // console.log({dataToSave});

        await commonService.create(GoodsQuotationRequestModel, dataToSave);
        let message = success.QUOTATION_REQ;

        return sendSuccessResponse(res, {}, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const myShippingRequests = async (req, res) => {
    try {
        let { _id } = req.userData;

        let findData = {
            status: { $ne: 3 },
            requestingUser: _id,
            isDeleted: false
        }
        let shipping = await commonService.findListWithPopulate(GoodsQuotationRequestModel, findData, {}, "goodsType", "name", { updatedAt: -1 });
        let message = success.LIST_FETCH;

        return sendSuccessResponse(res, shipping, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const myShipmentDatails = async (req, res) => {
    try {
        let { shipmentId } = req.body;

        let findData = {
            _id: shipmentId,
            isDeleted: false
        }
        let shipping = await GoodsQuotationRequestModel.findOne(findData).populate("goodsType", "name").sort({ updatedAt: -1 });
        let message = success.DETAILS_FETCH;

        return sendSuccessResponse(res, shipping, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const myShippingOrders = async (req, res) => {
    try {
        let { _id } = req.userData;

        let findData = {
            userId: _id,
        }
        let shipping = await OrderModel.find(findData).populate("goodsType", "name").populate("couponId").sort({ createdAt: -1 });
        let message = success.LIST_FETCH;

        return sendSuccessResponse(res, shipping, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const myShipmentOrderDatails = async (req, res) => {
    try {
        let { orderId } = req.body;

        let findData = {
            _id: orderId,
        }
        let shipping = await OrderModel.findOne(findData).
            populate("goodsType", "name")
            .populate("couponId")
            .populate({
                path: 'wareHouseId',
                options: { strictPopulate: false },
            })
            .populate({
                path: 'reviews',
                select: 'rating comment',
            })
            .lean();
        let message = success.DETAILS_FETCH;
        // console.log("Shipping Data with Reviews: ", shipping.reviews);
        console.log("rev", shipping)

        return sendSuccessResponse(res, shipping, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const updateAddress = async (req, res) => {
    try {
        let { orderId, receiverAddress } = req.body;

        let findData = {
            _id: orderId,
        }
        let order = await OrderModel.findOneAndUpdate(findData, { $set: { receiverAddress: receiverAddress } }, { new: true });
        let message = success.UPDATED;

        return sendSuccessResponse(res, order, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const trackOrder = async (req, res) => {
    try {
        let { orderNumber } = req.body;

        let findData = {
            orderId: orderNumber,
        }
        let shipping = await OrderModel.findOne(findData).populate("goodsType", "name").populate("couponId").lean();
        let message = success.DETAILS_FETCH;

        return sendSuccessResponse(res, shipping, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        let { orderId, status } = req.body;

        let findData = {
            _id: orderId,
        }
        let updateData = {
            status: status
        }
        if (status == 2) {
            updateData = {
                status: status,
                shippingOn: new Date().getTime(),
                modifiedAt: new Date().getTime(),
            }
        } else if (status == 3) {
            updateData = {
                status: status,
                outForShippingOn: new Date().getTime(),
                modifiedAt: new Date().getTime(),
            }
        } else if (status == 4) {
            updateData = {
                status: status,
                packedOn: new Date().getTime(),
                modifiedAt: new Date().getTime(),
            }
        } else if (status == 5) {
            updateData = {
                status: status,
                outForDeliveryOn: new Date().getTime(),
                modifiedAt: new Date().getTime(),
            }
        } else if (status == 6) {
            updateData = {
                status: status,
                deliveredOn: new Date().getTime(),
                modifiedAt: new Date().getTime(),
            }
        } else if (status == 7) {
            updateData = {
                status: status,
                cancelledOn: new Date().getTime(),
                modifiedAt: new Date().getTime(),
            }
        }
        let order = await OrderModel.findOneAndUpdate(findData, { $set: updateData }, { new: true });
        let message = success.UPDATED;

        return sendSuccessResponse(res, order, message, HttpStatus.OK);
    } catch (err) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const chooseDeliveryType = async (req, res) => {
    try {
        const { orderId, deliveryType } = req.body;


        if (!orderId || !deliveryType) {
            return sendErrorResponse(res, 'Order ID and delivery type are required', HttpStatus.BAD_REQUEST);
        }

        let order = await OrderModel.findById(orderId);

        if (!order) {
            return sendErrorResponse(res, 'Order not found', HttpStatus.NOT_FOUND);
        }

        order.deliveryType = deliveryType;
        await order.save();

        const message = deliveryType === 0 ? 'Delivery type updated to pickup' : 'Delivery type updated to deliver';

        return sendSuccessResponse(res, { orderId, deliveryType }, message, HttpStatus.OK);
    } catch (err) {
        console.log("errr", err)
        return sendErrorResponse(res, err.message, HttpStatus.SOMETHING_WRONG);
    }
};
