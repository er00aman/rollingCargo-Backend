import { Router } from "express";
const router = Router();

import auth from "./auth";
import users from "./user";
import banner from "./banner";
import goodsCategory from "./goodsCategory";
import deliveryCharge from "./deliveryCharge";
import coupon from "./coupon";
import wareHouse from "./wareHouse";
import subAdmin from "./subAdmin";
import shipment from "./shipment";

router.use("/auth", auth);
router.use("/user", users);
router.use("/banner", banner);
router.use("/goodsCategory", goodsCategory);
router.use("/deliveryCharge", deliveryCharge);
router.use("/coupon", coupon);
router.use("/wareHouse", wareHouse);
router.use("/subAdmin", subAdmin);
router.use("/shipment", shipment);

export default router;
