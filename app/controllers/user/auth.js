import HttpStatus from 'http-status-codes'
import * as commonService from '../../services/common/common.service';
import { generatePassword, comparePassword } from '../../utils/password';
import AdminModel from '../../models/admin/admin.model';
import {sendSuccessResponse,sendErrorResponse } from '../../responses/response'
import { success, error } from '../../responses/messages'
import { generateJwtToken } from '../../utils/jwt'
import UserModel from '../../models/user/user.model';
import generateUniqueId from 'generate-unique-id';

/****************************************
*************** SPRINT 1 ****************
*****************************************/
export const uploadUserFile = async (req, res) => {
  try {
      if (req.files.upload_user_file != undefined || req.files.upload_user_file != null) {
        req.body.upload_user_file = req.files.upload_user_file[0].location ? req.files.upload_user_file[0].location : '';
      }
      let { upload_user_file } = req.body;
      if (!upload_user_file || upload_user_file == '')
          return { status: 0, message: "File is required" };
      return sendSuccessResponse(res,upload_user_file, success.UPLOAD_SUCCESS, HttpStatus.OK )
      } catch (error) {
      res.status(403).json({ message: error.message });
  }
}

export const register = async (req, res) => {
  try {
    let { name, email, password, countryCode,countryIsoCode, phoneNumber, country, city, confirmPassword, deviceType, deviceToken,latitude, longitude } = req.body;
    const lowerCaseEmail = email.toLowerCase();

    const emailExists = await commonService.findOne(UserModel, { email });
    if(emailExists){
      return sendErrorResponse(res, error.EMAIL_ALREADY_EXISTS , HttpStatus.BAD_REQUEST); 
    }

    const mobileExists = await commonService.findOne(UserModel, { countryCode, phoneNumber });
    if(mobileExists){
      return sendErrorResponse(res, error.MOBILE_ALREADY_EXIST , HttpStatus.BAD_REQUEST); 
    }
    if(password != confirmPassword){
      return sendErrorResponse(res, error.PASS_NOT_MATCHED , HttpStatus.BAD_REQUEST); 
    }

    req.body.otp = 1234
    // req.body.otp = otp;
    // req.body.type = 1
    const accessToken = generateJwtToken({countryCode : countryCode, phoneNumber : phoneNumber,email:email,otp:req.body.otp, password: password, name: name,country:country, city: city, countryIsoCode: countryIsoCode }, "5m").token;
    // let mobileNumber = countryCode + phoneNumber;
    // await sendotp(otp, mobileNumber);
    let verifyUser = "OTP sent to your mobile number successfully";
    return sendSuccessResponse(res,{ accessToken: accessToken }, verifyUser, HttpStatus.OK );

  } catch (error) {
    return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
  }
};


export const login = async (req, res) => {
  try {
    const { email, countryCode, phoneNumber,deviceType, deviceToken,password, latitude, longitude } = req.body;
    const userResp = await commonService.findOne(UserModel, {$or:[{email: email},{$and:[{phoneNumber: phoneNumber}, {countryCode: countryCode}]}]})

    if (!userResp) {
      let verifyUser = "Invalid mobile number or email";
      return sendSuccessResponse(res,{}, verifyUser, HttpStatus.BAD_REQUEST)
    }

    if (userResp.isBlocked) {
      let accountBlocked = "Your account has been blocked.";
      if(userResp.language && userResp.language == "1"){
        accountBlocked = "تم حظر حسابك.";
      }
      return sendErrorResponse(res, accountBlocked , HttpStatus.BAD_REQUEST); 
    }

    let validPassword = await comparePassword(password ,userResp.password)
    if (!validPassword) {
      let invaliPass = "Invalid password";
      return sendErrorResponse(res, invaliPass, HttpStatus.NOT_FOUND)
    }
    let accessToken = generateJwtToken({countryCode :countryCode, phoneNumber : phoneNumber,_id:userResp._id,email:userResp.email}, "2d").token;
    let updateData = { 
      accessToken, 
      lastLogin: new Date().getTime(), 
      deviceType: deviceType, 
      deviceToken: deviceToken,
      // latitude,
      // longitude,
      // location: [latitude, longitude]
    }
    await commonService.findOneAndUpdate(UserModel,{_id : userResp._id,}, updateData)
    let fetchUser = await commonService.getById(UserModel, userResp._id,{ otp:0, password:0 })
    
    let userLogin = "User logged in successfully";   
    return sendSuccessResponse(res,fetchUser, userLogin, HttpStatus.OK)

  } catch (error) {
    return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
  };
}

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { language } = req.tokenUser;
    let tokenResp = req.tokenUser;
    if (tokenResp.otp != otp) {
      let validOtp = "Please enter a valid OTP.";
      if(language && language == "1"){
        validOtp = "الرجاء إدخال كلمة المرور لمرة واحدة (OTP) صالحة.";
      }
      return sendErrorResponse(res, validOtp, 400);
    }
    tokenResp.isOtpVerified = true;
    let isUserExists = await commonService.findOne(UserModel, {$or:[{email: tokenResp.email},{$and:[{phoneNumber: tokenResp.phoneNumber}, {countryCode: tokenResp.countryCode}]}]})
    let verifyOtp = "OTP verified successfully!";
    if(language && language == "1"){
      verifyOtp = "تم التحقق من OTP بنجاح!";
    }
    if(!isUserExists){
      tokenResp.password = await generatePassword(tokenResp.password)
      tokenResp.createdAt = new Date().getTime();
      tokenResp.updatedAt = new Date().getTime();
      tokenResp.otp =  null;
      tokenResp.isProfileCompleted = true;

      const userResp = await commonService.create(UserModel, tokenResp);
      let accessToken = generateJwtToken({ _id: userResp._id, phoneNumber: tokenResp.phoneNumber, countryCode: tokenResp.countryCode, email: tokenResp.email, countryIsoCode: tokenResp.countryIsoCode }, "2d").token;
      let updateUser = await commonService.findOneAndUpdate(UserModel, {_id: userResp._id},{ accessToken } )
      let fetchUser = await commonService.getById(UserModel, userResp._id,{ otp:0 , password:0})

      return sendSuccessResponse(res,fetchUser, verifyOtp, HttpStatus.OK );
    }else{
      let accessToken = generateJwtToken({ _id: isUserExists._id, phoneNumber: tokenResp.phoneNumber, countryCode: tokenResp.countryCode, email: tokenResp.email, countryIsoCode: tokenResp.countryIsoCode }, "2d").token;
      let dataToUpdate = {
        accessToken: accessToken,
        updatedAt: new Date().getTime(),
        otp: null,
        isOtpVerified: true,
        isProfileCompleted: true
      }
      let updateUser = await commonService.findOneAndUpdate(UserModel, {_id: isUserExists._id},dataToUpdate)
      let fetchUser = await commonService.getById(UserModel, isUserExists._id,{ otp:0 , password:0})
      return sendSuccessResponse(res,fetchUser, verifyOtp, HttpStatus.OK );
    }
  } catch (error) {
    sendErrorResponse(res, error.message)
  }
};

export const updateProfile = async (req, res) => {
  try {
    let { _id } = req.body;
    let { name, profileImg } = req.body

    const userData = await commonService.findOne(UserModel, {_id : _id})
    if(userData) {
        req.body.isProfileCompleted = true;
      
        const updated = await commonService.findOneAndUpdate(UserModel,{_id : userData._id}, req.body, {new : true} )
        let fetchUser = await commonService.getById(UserModel, userData._id,{ otp:0 , password:0})

        return sendSuccessResponse(res, fetchUser, success.UPDATED, HttpStatus.OK)
    }else {
        return sendErrorResponse(res, error.DEFAULT_ERROR, HttpStatus.BAD_REQUEST);
    }  
  } catch (error) {
      return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
  }
}

export const getProfile = async (req, res) => {
  try {
    let { _id } = req.userData;
  
    const userData = await commonService.getById(UserModel, _id,{ otp:0, password:0 })
    if(userData) {
        return sendSuccessResponse(res, userData, success.DETAILS_FETCH, HttpStatus.OK)
    }else {
        return sendErrorResponse(res, error.DEFAULT_ERROR, HttpStatus.BAD_REQUEST);
    }  
  } catch (error) {
      return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
  }
}

export const logout = async (req, res) => {
  try {
    let { _id } = req.userData;

    const userData = await commonService.findOne(UserModel, {_id : _id})
    if(userData) {
        const updated = await commonService.findOneAndUpdate(UserModel,{_id : userData._id}, { accessToken: null }, {new : true} )
        return sendSuccessResponse(res, {}, success.LOGOUT, HttpStatus.OK)
    }else {
        return sendErrorResponse(res, error.DEFAULT_ERROR, HttpStatus.BAD_REQUEST);
    }  
  } catch (error) {
      return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
  }
}

export const resendOtp = async (req, res) => {
  try {
    delete req.tokenUser.iat;
    delete req.tokenUser.exp;

    console.log(req.tokenUser)
    // let otp = await helpers.randomStringGenerator();
    let otp = 1234;
    const accessToken = generateJwtToken(req.tokenUser, "5m").token;
    // let mobileNumber = req.tokenUser.countryCode + req.tokenUser.phoneNumber;
    // await sendotp(otp, mobileNumber);
    let passwordReset = "OTP resent successfully";
   
    return sendSuccessResponse(res, { phoneNumber: String(req.tokenUser.phoneNumber), countryCode: req.tokenUser.countryCode, accessToken },passwordReset,HttpStatus.OK)
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const forgetUserPasswordController = async (req, res) => {
  try {
    let { countryCode, phoneNumber } = req.body;

    const userResp = await commonService.findOne(UserModel, {phoneNumber, countryCode})

    if (!userResp) {
      let userAlreadyExist = "User does not exist with given phone number and country code.";
      return sendErrorResponse(res, userAlreadyExist, HttpStatus.BAD_REQUEST);
    }

    if (userResp.isUserBlocked) {
      let accountBlocked = "Your account has been blocked.";
      return sendErrorResponse(res, accountBlocked, HttpStatus.BAD_REQUEST);
    }
    let dataForToken = { ...userResp, otp: 1234 }
    // let otp = await helpers.randomStringGenerator();
    // const accessToken = helpers.generateToken({ countryCode, phoneNumber, otp: otp }, "5m")
    const accessToken = generateJwtToken(dataForToken, "2d").token;
    // let mobileNumber = countryCode + phoneNumber;
    // await sendotp(otp, mobileNumber);
    // phoneNumber = String(phoneNumber)

    let otpSent = "OTP sent to your mobile number successfully";
    // sendSuccessResponse(res, otpSent, { countryCode, phoneNumber, accessToken })
    return sendSuccessResponse(res, {phoneNumber: String(phoneNumber), countryCode, accessToken },otpSent,HttpStatus.OK)
  } catch (error) {
    sendErrorResponse(res, error.message);
  };
}

export const resetUserPasswordController = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body

    if (!req.userData?.isOtpVerified) {
      let verifyOtp = "Please verify OTP first.";
      return sendErrorResponse(res, verifyOtp, HttpStatus.BAD_REQUEST);
    }

    if (newPassword != confirmPassword) {
      let samePass = "Password should be same";
      return sendErrorResponse(res, samePass, HttpStatus.BAD_REQUEST);
    }

    const userResp = await commonService.findOne(UserModel, {phoneNumber: req.userData?.phoneNumber, countryCode: req.userData?.countryCode})
    if (!userResp) {
      let userAlreadyExist = "User does not exist with given phone number and country code.";
      return sendErrorResponse(res, userAlreadyExist, HttpStatus.BAD_REQUEST);
    }
    const passwordMatch = await comparePassword(newPassword ,userResp.password)
    if (passwordMatch) {
      let passwordSame = "New Password should not be same as old password";
      return sendErrorResponse(res, passwordSame, HttpStatus.NOT_FOUND);
    }
    let dataToUpdate = { 
      password: await generatePassword(newPassword),
      accessToken: null
    }
    let updateUser = await commonService.findOneAndUpdate(UserModel, {_id: userResp._id}, dataToUpdate)
    let passwordReset = "Password reset successfully";
    return sendSuccessResponse(res,{}, passwordReset)
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};