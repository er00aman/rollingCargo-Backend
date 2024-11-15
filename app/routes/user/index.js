import { Router } from "express";
const router = Router();

import auth from './auth';
import shipment from './shipment';

router.use("/auth", auth );
router.use("/shipment", shipment );

export default router;
