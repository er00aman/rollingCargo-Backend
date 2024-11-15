import { Router } from "express";
const router = Router();
import * as coupon from '../../controllers/admin/coupon'
import { verifyAdminToken } from "../../middlewares/authentication";
import { celebrate } from "celebrate";
import admin from "../../validation/admin.validation";

/****************************************
*************** SPRINT 2 ****************
*****************************************/

router.route("/add").post(celebrate({ body: admin.ADDCOUPON }, { abortEarly: false }), verifyAdminToken, coupon.addCoupon);
router.route("/edit").put(celebrate({ body: admin.EDITCOUPON }, { abortEarly: false }), verifyAdminToken, coupon.editCoupon);
router.route("/list").get(verifyAdminToken, coupon.getCoupon);
router.route("/block/unblock").patch(celebrate({ body: admin.BLOCKCOUPON }, { abortEarly: false }), verifyAdminToken, coupon.blockUnblockCoupon);
router.route("/delete").delete(celebrate({ body: admin.DELETECOUPON }, { abortEarly: false }), verifyAdminToken, coupon.deleteCoupon);

export default router;
