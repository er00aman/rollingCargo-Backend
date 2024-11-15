import { Router } from "express";
const router = Router();
import * as banner from '../../controllers/admin/banner'
import { verifyAdminToken } from "../../middlewares/authentication";
import { celebrate } from "celebrate";
import admin from "../../validation/admin.validation";

/****************************************
*************** SPRINT 1 ****************
*****************************************/

router.route("/add/banner").post(celebrate({ body: admin.ADDBANNER }, { abortEarly: false }), verifyAdminToken, banner.addBanner);
router.route("/edit/banner").put(celebrate({ body: admin.EDITBANNER }, { abortEarly: false }), verifyAdminToken, banner.editBanner);
router.route("/get/banner").get(verifyAdminToken, banner.getBanner);
router.route("/block/unblock").patch(celebrate({ body: admin.BLOCKBANNER }, { abortEarly: false }), verifyAdminToken, banner.blockUnblockBanner);
router.route("/delete/banner").post(celebrate({ body: admin.DELETEBANNER }, { abortEarly: false }), verifyAdminToken, banner.deleteBanner);


export default router;
