import { Router } from "express";
const router = Router();
import * as deliveryCharge from '../../controllers/admin/deliveryCharge'
import { verifyAdminToken } from "../../middlewares/authentication";
import { celebrate } from "celebrate";
import admin from "../../validation/admin.validation";

/****************************************
*************** SPRINT 2 ****************
*****************************************/

router.route("/add").post(celebrate({ body: admin.ADDDELIVERCHARGE }, { abortEarly: false }), verifyAdminToken, deliveryCharge.addDeliveryCharge);
router.route("/edit").put(celebrate({ body: admin.EDITDELIVERCHARGE }, { abortEarly: false }), verifyAdminToken, deliveryCharge.editDeliveryCharge);
router.route("/list").get(verifyAdminToken, deliveryCharge.getDeliveryCharge);
router.route("/block/unblock").patch(celebrate({ body: admin.BLOCKDELIVERCHARGE }, { abortEarly: false }), verifyAdminToken, deliveryCharge.blockUnblockDeliveryCharge);
router.route("/delete").delete(celebrate({ body: admin.DELETEDELIVERCHARGE }, { abortEarly: false }), verifyAdminToken, deliveryCharge.deleteDeliveryCharge);

export default router;
