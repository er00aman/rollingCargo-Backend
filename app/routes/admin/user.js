import { Router } from "express";
const router = Router();
import * as user from '../../controllers/admin/user'
import { verifyAdminToken } from "../../middlewares/authentication";

/****************************************
*************** SPRINT 1 ****************
*****************************************/

router.route("/list").get(user.fetchList);
router.route("/status").put(user.blockUnblock);


export default router;
