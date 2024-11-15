import { Router } from "express";
const router = Router();
import * as goodsCategory from '../../controllers/admin/goodsCategory'
import { verifyAdminToken } from "../../middlewares/authentication";
import { celebrate } from "celebrate";
import admin from "../../validation/admin.validation";

/****************************************
*************** SPRINT 2 ****************
*****************************************/

router.route("/add").post(celebrate({ body: admin.ADDCATEGORY }, { abortEarly: false }), verifyAdminToken, goodsCategory.addGoodsCategory);
router.route("/edit").put(celebrate({ body: admin.EDITCATEGORY }, { abortEarly: false }), verifyAdminToken, goodsCategory.editGoodsCategory);
router.route("/list").get(verifyAdminToken, goodsCategory.getGoodsCategory);
router.route("/block/unblock").patch(celebrate({ body: admin.BLOCKCATEGORY }, { abortEarly: false }), verifyAdminToken, goodsCategory.blockUnblockGoodsCategory);
router.route("/delete").delete(celebrate({ body: admin.DELETECATEGORY }, { abortEarly: false }), verifyAdminToken, goodsCategory.deleteGoodsCategory);


export default router;
