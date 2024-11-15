import { Router } from "express";
const router = Router();
import * as wareHouse from '../../controllers/admin/wareHouse'
import { verifyAdminToken } from "../../middlewares/authentication";
import { celebrate } from "celebrate";
import admin from "../../validation/admin.validation";

/****************************************
*************** SPRINT 3 ****************
*****************************************/

router.route("/add").post(celebrate({ body: admin.ADDWAREHOUSE }, { abortEarly: false }), verifyAdminToken, wareHouse.addWareHouse);
router.route("/edit").put(celebrate({ body: admin.EDITWAREHOUSE }, { abortEarly: false }), verifyAdminToken, wareHouse.editWareHouse);
router.route("/list").get(verifyAdminToken, wareHouse.getWareHouse);
router.route("/block/unblock").patch(celebrate({ body: admin.BLOCKWAREHOUSE }, { abortEarly: false }), verifyAdminToken, wareHouse.blockUnblockWareHouse);
router.route("/delete").delete(celebrate({ body: admin.DELETEWAREHOUSE }, { abortEarly: false }), verifyAdminToken, wareHouse.deleteWareHouse);
router.route("/by/country").post(celebrate({ body: admin.FETCHWAREHOUSE }, { abortEarly: false }), verifyAdminToken, wareHouse.fetchWareHouseByCountry);

export default router;
