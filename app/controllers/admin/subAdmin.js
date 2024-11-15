import mongoose from "mongoose";
import { generatePassword } from "../../utils/password";
import { generateJwtToken } from '../../utils/jwt'
import { sendEmail } from "../../utils/sendGrid";
import generateUniqueId from 'generate-unique-id';
import SubAdminModel from '../../models/admin/subAdmin';
import * as commonService from "../../services/common/common.service";
import { success, error } from '../../responses/messages'
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response';
import HttpStatus from 'http-status-codes'
import { Country, State, City } from 'country-state-city';
import WareHouseModel from '../../models/admin/warehouse.model';

export const addsubAdmin = async (req, res) => {
  try {
    const resp = await commonService.findwithCondition(SubAdminModel, { email: req.body.email, isDeleted: false });
    if (!!resp) {
      return sendErrorResponse(res, "Sub admin already exists with given email", HttpStatus.BAD_REQUEST);
    }
    const response = await commonService.findwithCondition(SubAdminModel, { wareHouseId: req.body.wareHouseId, isDeleted: false });
    if (!!response) {
      return sendErrorResponse(res, "This Warehouse Is Already Assigned To Other Subadmin", HttpStatus.BAD_REQUEST);
    }
    // if(req.body.password != req.body.confirmPassword){
    //   return sendErrorResponse(res, "Password and confirm password should be same", HttpStatus.BAD_REQUEST);
    // }

    req.body.adminId = req.adminData._id;
    req.body.fullName = req.body.fullName;
    req.body.simplePassword = req.body.password;
    req.body.subAdminId = (generateUniqueId({ length: 7, useLetters: true }).toUpperCase());
    req.body.password = await generatePassword(req.body.password);
    req.body.deviceType = 3;
    req.body.createdAt = new Date().getTime();
    req.body.updatedAt = new Date().getTime();
    let data = await commonService.create(SubAdminModel, req.body);

    let payload = { _id: data?._id, phoneNumber: data.phoneNumber, countryCode: data.countryCode, email: data.email };
    let accessToken = generateJwtToken(payload, "24h").token;

    let updateData = await commonService.updateByCondition(SubAdminModel, { _id: data._id }, { accessToken: accessToken });
    let findSubAdmin = await commonService.getById(SubAdminModel, { _id: data._id }, {});
    let updateWarehouse = await commonService.updateByCondition(WareHouseModel, { _id: req.body.wareHouseId }, { subAdminId: data._id });

    return sendSuccessResponse(res, findSubAdmin, success.CREATED, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const editsubAdmin = async (req, res) => {
  try {
    const subAdminResp = await commonService.findwithCondition(SubAdminModel, { _id: req.body._id });
    if (!subAdminResp) {
      return sendErrorResponse(res, error.SUBADMIN_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    if (subAdminResp.email != req.body.email) {
      const emailResp = await commonService.findwithCondition(SubAdminModel, { email: req.body.email });
      if (!!emailResp) {
        return sendErrorResponse(res, error.EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
      }
    }
    const wareHouseCity = await commonService.findOne(SubAdminModel, { _id: { $ne: req.body._id }, wareHouseId: req.body.wareHouseId, assignedCountry: req.body.assignedCountry, assignedCity: req.body.assignedCity });
    if (wareHouseCity) {
      return sendErrorResponse(res, "This warehouse already exist with other subadmin", HttpStatus.BAD_REQUEST);
    }

    if (!req.body?.hasOwnProperty("isBlocked")) {
      req.body.simplePassword = req.body.password;
      req.body.password = await generatePassword(req.body.password);
    }
    if (subAdminResp?.wareHouseId) {
      let updateLastWarehouse = await commonService.updateByCondition(WareHouseModel, { _id: subAdminResp.wareHouseId }, { subAdminId: null });
    }
    const updateData = await commonService.findOneAndUpdate(SubAdminModel, req.body._id, req.body);
    let findSubAdmin = await commonService.getById(SubAdminModel, { _id: req.body._id }, { accessToken: 0 });
    let updateWarehouse = await commonService.updateByCondition(WareHouseModel, { _id: req.body.wareHouseId }, { subAdminId: req.body._id });

    return sendSuccessResponse(res, findSubAdmin, success.UPDATED, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const getsubAdminList = async (req, res) => {
  try {
    const data = await commonService.findListWithPopulateWithoutKey(SubAdminModel, { isDeleted: false }, { accessToken: 0 }, "wareHouseId", { createdAt: -1 });
    return sendSuccessResponse(res, data, success.LIST_FETCH, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const getsubAdmin = async (req, res) => {
  try {
    const data = await commonService.findOneWithPopulateWithoutPopulateKey(SubAdminModel, { _id: req.params.id }, { accessToken: 0 }, "wareHouseId");
    return sendSuccessResponse(res, data, success.DETAILS_FETCH, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const deletesubAdmin = async (req, res) => {
  try {
    const updateData = await commonService.findOneAndDelete(SubAdminModel, { _id: req.params.id });

    return sendSuccessResponse(res, null, success.DELETED_SUCCESS, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const sendCredentials = async (req, res) => {
  try {
    const { id } = req.params;

    const resp = await commonService.findwithCondition(SubAdminModel, { _id: id });

    if (!resp) {
      return sendErrorResponse(res, error.SUBADMIN_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    // const emailResp = await sendEmail({
    //   toEmail: resp.email,
    //   subject: "HOOK - Sub-admin Login Credentials",
    //   text: "You can now log in to HOOK Admin.",
    //   html: `
    //     <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    //       <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1); padding: 20px;">
    //       <div style="color: #333; font-size: 15px;">
    //       Dear <strong>${resp?.fullName?.trim() || "User"}</strong>,
    //       A new account has been created for you in <strong>HOOK</strong>.
    //     </div>            
    //     <h6 style="color: #666; margin-bottom: 20px; font-size: 14px;">Use the below given credentials for login your account.</h6>
    //         <div style="font-size: 16px;">
    //           <div style="margin-bottom: 10px;"><strong>URL:</strong> http://16.16.39.223:3000/admin-panel/login</div>
    //           <div style="margin-bottom: 10px;"><strong>Email:</strong> ${resp.email
    //     }</div>
    //           <div style="margin-bottom: 60px;"><strong>Password:</strong> ${resp.simplePassword
    //     }</div>
    //         </div>
    //         <div style="margin-bottom: 10px;"><strong>________________</strong></div>
    //         <p style="color: #666;">Regards,</p>
    //         <p style="color: #666;">HOOK</p>
    //       </div>
    //     </div>
    //   `,
    // });

    // if (!emailResp.success) {
    //   return sendErrorResponse(res, emailResp.error, 500);
    // }

    return sendSuccessResponse(res, null, "Credentials sent successfully", HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const blockUnblocksubAdmin = async (req, res) => {
  try {
    const subAdminResp = await commonService.findwithCondition(SubAdminModel, { _id: req.params.id });

    if (!subAdminResp) {
      return sendErrorResponse(res, error.SUBADMIN_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    let { isBlocked } = req.body;

    let msg = ((isBlocked == 1) ? "Sub Admin blocked successfully" : "Sub Admin unblocked successfully")

    let updateData = {
      isBlocked
    }
    const data = await commonService.findOneAndUpdate(SubAdminModel, req.params.id, updateData);
    let findSubAdmin = await commonService.getById(SubAdminModel, { _id: req.params.id }, { accessToken: 0, simplePassword: 0 });
    return sendSuccessResponse(res, findSubAdmin, msg, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const getCountryList = async (req, res) => {
  try {
    let countrys = await Country.getAllCountries()
    let dataToSend = {
      countryList: countrys
    }
    sendSuccessResponse(res, dataToSend, "All countries fetch", 200);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const getCityList = async (req, res) => {
  try {
    let { countryCode } = req.body;

    let city = await City.getCitiesOfCountry(countryCode)
    let dataToSend = {
      cityList: city
    }
    sendSuccessResponse(res, dataToSend, "All cities fetch", 200);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const getWareHouseCity = async (req, res) => {
  try {
    let { country } = req.body;

    let city = await WareHouseModel.find({ country: country }, { city: 1 }).lean();
    // Get unique elements by 'city'
    const uniqueCityList = city.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.city === value.city
      ))
    );
    let dataToSend = {
      cityList: uniqueCityList
    }
    sendSuccessResponse(res, dataToSend, "All cities fetch", 200);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};