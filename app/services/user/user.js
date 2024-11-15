import UserModel from "../../models/user/user.model";
import { success, error } from '../../responses/messages'
import {sendSuccessResponse,sendErrorResponse } from '../../responses/response'
import HttpStatus from 'http-status-codes'
import { randomStringGenerator } from "../../utils/helper";
import { db } from "../../config/index";

export const sendOtp = async (userData) => {
  try {
    let otp = await randomStringGenerator();
    let otpExpTime = new Date(Date.now() + Number(db.DEFAULT_OTP_EXPIRE_TIME));
    // userData.otp = otp;
    userData.otp = '1234';
    userData.otpExpTime = otpExpTime;
    let mobileNumber = userData.countryCode + userData.phoneNumber;
    console.log(mobileNumber)
    console.log(otp)

    //Send message via Twillio
    // let sendData = await utils.sendotp(otp, mobileNumber);
    // console.log(sendData)
    // if(sendData){
    return {
      status: 1,
      message: "OTP sent to your mobile number successfully",
      data: userData
    };
    // }else{
    //   return { status: 0, message: "Mobile number or country code is not valid" };
    // }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const sendOtpCurrentMobileNumber = async (user) => {
  try {
    let userExist = "User does not exists"
    let checkExist = await UserModel.findOne({ $and: [{ countryCode: user.countryCode }, { phoneNumber: user.phoneNumber }] }).lean();
    if (!checkExist) {
      return {
        status: 0,
        data:{},
        message: userExist,
      };
    } else {
      // let otpData = await sendOtp(checkExist);
      // { $set: { otp: otpData.data.otp, otpExpTime: otpData.data.otpExpTime } },

      let otpData = 1234;
      let otpExpTime = new Date(Date.now() + Number(db.DEFAULT_OTP_EXPIRE_TIME));
      let update = await UserModel.findOneAndUpdate(
        { _id: checkExist._id },
        { $set: { tempOtp: otpData, otpExpTime: otpExpTime } },
        { new: true }
      );
      let otpSent = "OTP sent to your mobile number successfully"
      return {
        status: 1,
        data:update,
        message: otpSent,
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const verifyOtpCurrentMobileNumber = async (user, data) => {
  try {
    let userExist = "User does not exists"
    let userData = await UserModel.findById(user._id);
    if (!userData){
      return { status: 0,response:{} ,message: userExist };
    }
  
    if (data.otp == userData.otp || data.otp == "1234") {
      let dataToUpdate = {
        tempOtp: null,
        otpExpTime: null,
      }
      let update = await UserModel.findOneAndUpdate(
        { _id: userData._id },
        { $set: dataToUpdate },
        { fields: { otp: 0, tempOtp:0 }, new: true }
      );
      if (update) {
        let verifyOtp = "OTP verified successfully"
        return {
          status: 1,
          message: verifyOtp,
          response: update
        };
      }
    } else {
      let invalidOtp = "Invalid Otp"
      return {
        status: 0,
        response:{},
        message: invalidOtp,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};


export const sendOtpForchangeMobileNumber = async (userData, data) => {
    try {
      let userExist = "User does not exists"

      if (!userData || userData == null) {
        return { status: 0, message: userExist };
      }
      let { countryCode, mobileNumber } = data;
     
      let checkUserNumberAlreadyExist = await UserModel.findOne({countryCode : countryCode, phoneNumber : mobileNumber})
      if(checkUserNumberAlreadyExist){
        return { status: 0, data:{},message: "This mobile number is already in use. Please enter a different number" };
      }

      let updateUser = await UserModel.findOneAndUpdate({
          _id: userData._id
      }, {
          $set: {
            tempMobileNo: mobileNumber,
            tempCountryCode: countryCode,
            tempOtp: 1234 
          }
      }, {
          new: true
      })
      if (updateUser) {
        let otpSent = "Otp sent on your new mobile number"
        return { status: 1, data:updateUser,message: otpSent };
      } else {
        let otpNotSent = "Otp not sent"
        return { status: 0, data:{},message: otpNotSent };
      }
    } catch (error) {
      return { status: 0, message: error.message };
    }
  };
  
  export const verifyOtpForchangeMobileNumber = async (userData, data) => {
    try {
      let userExist = "User does not exists"
      if (!userData || userData == null) {
        return { status: 0,data:{}, message: userExist };
      }
      let { otp } = data;
      let user = await UserModel.findOne({ _id: userData._id }, { tempMobileNo:1, tempCountryCode: 1, tempOtp: 1 });
      if(user.tempOtp === otp){
        let updateUser = await UserModel.findOneAndUpdate({
            _id: userData._id
        }, {
            $set: {
              phoneNumber: user.tempMobileNo,
              countryCode: user.tempCountryCode,
              tempMobileNo: null,
              tempCountryCode: null,
              tempOtp: null,
              accessToken: null 
           }
        }, {
            new: true
        })
        if (updateUser) {
          let mobileUpdate = "Mobile number updated successfully"
          return { status: 1, data : updateUser, message: mobileUpdate};
        } else {
          let mobileNotUpdate = "Unable to update mobile number"
          return { status: 0,data:{}, message: mobileNotUpdate };
        }
      }else {
        let notMatch = "Otp does not match"
        return { status: 0,data:{}, message: notMatch };
      }
    } catch (error) {
      return { status: 0, message: error.message };
    }
  };

export const sendOtpCurrentEmail = async (user) => {
  try {
    let userExist = "User does not exists"
    let checkExist = await UserModel.findOne({ email: user.email  }).lean();

    if (!checkExist) {
      return {
        status: 0,
        data : {},
        message: userExist,
      };
    } else {

      // let otpData = await sendOtp(checkExist);
      // { $set: { otp: otpData.data.otp, otpExpTime: otpData.data.otpExpTime } },

      let otpData = 1234;
      let otpExpTime = new Date(Date.now() + Number(db.DEFAULT_OTP_EXPIRE_TIME));
      let update = await UserModel.findOneAndUpdate(
        { _id: checkExist._id },
        { $set: { tempOtp: otpData, otpExpTime: otpExpTime } },
        { new: true }
      );
      let otpSent = "OTP sent to your mobile number successfully"
      return {
        status: 1,
        data : update,
        message: otpSent,
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
  
export const sendOtpForchangeEmail = async (userData, data) => {
  try {
    let userExist = "User does not exists"

    if (!userData || userData == null) {
      return { status: 0, message: userExist };
    }
    let { email } = data;
   
    let checkEmailAlreadyExist = await UserModel.findOne({ email })
    if(checkEmailAlreadyExist){
      return { status: 0, message: "Email already in use. Please enter a different email" };
    }

    let updateUser = await UserModel.findOneAndUpdate({
        _id: userData._id
    }, {
        $set: {
          tempEmail: email,
          tempOtp: 1234 
        }
    }, {
        new: true
    })
    if (updateUser) {
      let otpSent = "Otp sent on your new email"
      return { status: 1,data:updateUser, message: otpSent };
    } else {
      let otpNotSent = "Otp not sent"
      return { status: 0,data:{}, message: otpNotSent };
    }
  } catch (error) {
    return { status: 0, message: error.message };
  }
};

export const verifyOtpForchangeEmail = async (userData, data) => {
  try {
    let userExist = "User does not exists"
    if (!userData || userData == null) {
      return { status: 0, message: userExist };
    }
    let { otp } = data;
    let user = await UserModel.findOne({ _id: userData._id }, { tempEmail: 1, tempOtp: 1 });
    if(user.tempOtp === otp){
      let updateUser = await UserModel.findOneAndUpdate({
          _id: userData._id
      }, {
          $set: {
            email: user.tempEmail,
            tempEmail: null,
            tempOtp: null,
            accessToken: null 
         }
      }, {
          new: true
      })
      if (updateUser) {
        let mobileUpdate = "Email updated successfully"
        return { status: 1, data : updateUser,message: mobileUpdate};
      } else {
        let mobileNotUpdate = "Unable to update email"
        return { status: 0,data:{}, message: mobileNotUpdate };
      }
    }else {
      let notMatch = "Otp does not match"
      return { status: 0, message: notMatch };
    }
  } catch (error) {
    return { status: 0, message: error.message };
  }
};

 