import { Router } from "express";
import { celebrate } from "celebrate";
const router = Router();
import * as auth from '../../controllers/user/auth'
import user from "../../validation/user.validation";
import { verifyUserToken } from "../../middlewares/authentication";
import * as shipment from "../../controllers/user/shipment";

/****************************************
*************** SPRINT 2 ****************
*****************************************/

router.route("/banner/list").get(shipment.getBannerList)
router.route("/coupon/list").get(shipment.getCouponList)
router.route("/goods/category").get(shipment.getGoodsCategoryList)
router.route("/delivery/charges").post(celebrate({ body: user.DELIVERY_CHARGE }, { abortEarly: false }), shipment.getDeliveryChargesList)
router.route("/apply/coupon").post(celebrate({ body: user.APPLY_COUPON }, { abortEarly: false }), verifyUserToken, shipment.applyCoupon)
router.route("/calculate/shipment").post(celebrate({ body: user.CALCULATE_SHIPMENT }, { abortEarly: false }), verifyUserToken, shipment.calculateShipment)
router.route("/check/valid/country/order").post(celebrate({ body: user.CHECK_VALID_COUNTRY_ORDER }, { abortEarly: false }), verifyUserToken, shipment.checkValidCountryOrder)
router.route("/place/order").post(celebrate({ body: user.PLACE_ORDER }, { abortEarly: false }), verifyUserToken, shipment.placeOrder)
router.route("/send/large/goods").post(celebrate({ body: user.SEND_LARGE_GOODS }, { abortEarly: false }), verifyUserToken, shipment.sendLargeGoods)
router.route("/export/goods").post(celebrate({ body: user.EXPORT_GOODS }, { abortEarly: false }), verifyUserToken, shipment.exportGoods)

/****************************************
*************** SPRINT 4 ****************
*****************************************/

router.route("/add/review").post(celebrate({ body: user.REVIEW }, { abortEarly: false }), verifyUserToken, shipment.createReview)
router.route("/calculate/shipment/request").post(celebrate({ body: user.AFTER_CALCULATE_SHIPMENT }, { abortEarly: false }), verifyUserToken, shipment.calculateShipmentRequest)
router.route("/my/shipping/request").get(verifyUserToken, shipment.myShippingRequests)
router.route("/get/shipment/details").post(celebrate({ body: user.SHIPMENT_DETAILS }, { abortEarly: false }), verifyUserToken, shipment.myShipmentDatails)
router.route("/my/shipment/orders").get(verifyUserToken, shipment.myShippingOrders)
router.route("/order/details").post(celebrate({ body: user.ORDER_DETAILS }, { abortEarly: false }), verifyUserToken, shipment.myShipmentOrderDatails)
router.route("/update/address").patch(verifyUserToken, shipment.updateAddress)
router.route("/track/order").post(celebrate({ body: user.TRACK_ORDER }, { abortEarly: false }), verifyUserToken, shipment.trackOrder)
router.route("/update/order/status").patch(celebrate({ body: user.UPDATE_ORDER_STATUS }, { abortEarly: false }), verifyUserToken, shipment.updateOrderStatus)


router.route("/choose/deliveryType").post(verifyUserToken, shipment.chooseDeliveryType)
export default router;
