import { Router } from "express";
const router = Router();
import * as subAdmin from '../../controllers/admin/subAdmin'
import { verifyAdminToken } from "../../middlewares/authentication";
import { celebrate } from "celebrate";
import admin from "../../validation/admin.validation";

/****************************************
*************** SPRINT 3 ****************
*****************************************/

router.route("/add").post(celebrate({ body: admin.CREATE_SUB_ADMIN }, { abortEarly: false }), verifyAdminToken, subAdmin.addsubAdmin);
router.route("/edit").put(celebrate({ body: admin.EDIT_SUB_ADMIN }, { abortEarly: false }), verifyAdminToken, subAdmin.editsubAdmin);
router.route("/list").get(verifyAdminToken, subAdmin.getsubAdminList);
router.route("/block/unblock/:id").patch(celebrate({ body: admin.BLOCK_SUB_ADMIN }, { abortEarly: false }), verifyAdminToken, subAdmin.blockUnblocksubAdmin);
router.route("/delete/:id").delete(verifyAdminToken, subAdmin.deletesubAdmin);
router.route("/sendCred/:id").post(verifyAdminToken, subAdmin.sendCredentials);
router.route("/fetch/:id").get(verifyAdminToken, subAdmin.getsubAdmin);
router.route("/country/list").get(subAdmin.getCountryList);
router.route("/city/list").post(celebrate({ body: admin.CITY_LIST }, { abortEarly: false }), subAdmin.getCityList);
router.route("/wareHouse/city/list").post(celebrate({ body: admin.WAREHOUSE_CITY }, { abortEarly: false }), subAdmin.getWareHouseCity);

export default router;
