import { Router } from "express";
import { celebrate } from "celebrate";
const router = Router();
import * as auth from '../../controllers/user/auth'
import user from "../../validation/user.validation";
import { verifyUserToken } from "../../middlewares/authentication";
import { uploadUserFile } from '../../utils/aws-s3'
import  * as userController from "../../controllers/user/user";

/****************************************
*************** SPRINT 1 ****************
*****************************************/

router.route("/uploadFile").post(uploadUserFile, auth.uploadUserFile)
router.route("/register").post(celebrate({ body: user.REGISTER }), auth.register);
router.route("/login").post(celebrate({ body: user.LOGIN }), auth.login);
router.route("/verifyOtp").post(celebrate({ body: user.VERIFY_OTP }), verifyUserToken,auth.verifyOtp);
router.route("/update/profile").patch(verifyUserToken,auth.updateProfile);
router.route("/profile").get(verifyUserToken, auth.getProfile);
router.route("/logout").get(verifyUserToken, auth.logout);
router.route("/resendOtp").get(verifyUserToken, auth.resendOtp);
router.route("/send/otp/current/mobile").post(verifyUserToken, userController.sendOtpCurrentMobileNumber);
router.route("/verify/otp/current/mobile").post(celebrate({ body: user.VERIFY_OTP }, { abortEarly: false }), verifyUserToken, userController.verifyOtpCurrentMobileNumber);
router.route("/send/otp/change/mobile").post(verifyUserToken, userController.sendOtpForchangeMobileNumber);
router.route("/verify/otp/change/mobile").post(celebrate({ body: user.VERIFY_OTP }, { abortEarly: false }), verifyUserToken, userController.verifyOtpForchangeMobileNumber);
router.route("/forgotPassword").post(celebrate({ body: user.FORGET_PASSWRD }), auth.forgetUserPasswordController)
router.route("/resetPassword").post(celebrate({ body: user.RESET_PASSWORD }), verifyUserToken, auth.resetUserPasswordController);

router.route("/send/otp/current/email").get(verifyUserToken, userController.sendOtpCurrentEmail);
router.route("/send/otp/change/email").post(celebrate({ body: user.CHANGEEMAIL }, { abortEarly: false }), verifyUserToken, userController.sendOtpForchangeEmail);
router.route("/verify/otp/change/email").post(celebrate({ body: user.VERIFY_OTP }, { abortEarly: false }), verifyUserToken, userController.verifyOtpForchangeEmail);
router.route("/country/list").get(userController.getCountryList);
router.route("/city/list").post(celebrate({ body: user.CITY_LIST }, { abortEarly: false }), userController.getCityList);

export default router;
