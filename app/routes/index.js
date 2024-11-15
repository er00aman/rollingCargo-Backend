import { Router } from "express";
import adminRouter from './admin/index'
import userRouter from './user/index'

const router = Router();

/* GET home page. */

router.use("/admin", adminRouter);
router.use("/user", userRouter);

export default router;
