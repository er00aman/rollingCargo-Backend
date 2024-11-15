import { Router } from "express";
const router = Router();
// import * as shipment from '../../controllers/admin/shipment'
import * as shipment from '../../controllers/admin/shipment'
import { verifyAdminToken } from "../../middlewares/authentication";






router.route("/orders/status/1").get(verifyAdminToken, shipment.getPlacedOrders);
router.route("/acceptOrderById").post(verifyAdminToken, shipment.addLandingNoAndSend);
router.route("/ongoingOrder").get(verifyAdminToken, shipment.getAllOngoingOrder);
router.route("/pastOder").get(verifyAdminToken, shipment.getAllPastOrder);

router.route("/getOderAtReciver").get(verifyAdminToken, shipment.getAllOngoingOrderForReceiver)
router.route("/pickup/ongoing").get(verifyAdminToken, shipment.getAllPickupOngoingOrder)
router.route("/pickedUp").put(verifyAdminToken, shipment.markOrderAsPicked)
router.route("/pickup/pastOrder").get(verifyAdminToken, shipment.getAllPickedUpPastOrder)
router.route("/deliver/past").get(verifyAdminToken, shipment.getAllDeliverPastOrder)
router.route("/mark/delivered").put(verifyAdminToken, shipment.markOrderAsDelivered)



router.route("/deliver/ongoing").get(verifyAdminToken, shipment.getAllDeliverOngoingOrder)



// router.route("receiveAndNotify").patch(verifyAdminToken, shipment.receiveOrderAndNotifyUser)
router.route("/receivedOrder").put(verifyAdminToken, shipment.markOrderAsReceived)
router.route("/deliver/order").get(verifyAdminToken, shipment.getAllDeliverOngoingOrder)
router.route("/new/quotation").get(verifyAdminToken, shipment.getNewQuotationRequests)
router.route("/update/quotation").post(verifyAdminToken, shipment.updateQuotationPrices)
router.route("/get/quotation/withPrice").get(verifyAdminToken, shipment.getQuotationRequestsWithPrices)
router.route("/rejected/quotation").get(verifyAdminToken, shipment.getRejectedQuotationRequest)
router.route("/reject/quotation").put(verifyAdminToken, shipment.getQuotationRequestAndUpdateStatus)

export default router;