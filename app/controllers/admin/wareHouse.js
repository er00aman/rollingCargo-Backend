import * as commonService from "../../services/common/common.service";
import { success, error } from '../../responses/messages'
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response';
import WareHouseModel from "./../../models/admin/warehouse.model";
import HttpStatus from 'http-status-codes'
import SubAdminModel from "../../models/admin/subAdmin";

export const addWareHouse = async (req, res) => {
  try {
    req.body.createdAt = new Date().getTime();
    const wareHouseData = await commonService.findOne(WareHouseModel, { name: req.body.name, isDeleted: false });
    if (wareHouseData) {
      return sendErrorResponse(res, "This Warehouse Already Exists", HttpStatus.BAD_REQUEST);
    }
    // const wareHouseCity = await commonService.findOne(WareHouseModel, { country: req.body.country, city: req.body.city });
    // if(wareHouseCity){
    //     return sendErrorResponse(res, "City is already added in other warehouse for this country", HttpStatus.BAD_REQUEST);
    // }
    const data = await commonService.create(WareHouseModel, req.body);
    return sendSuccessResponse(res, data, success.CREATED, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const editWareHouse = async (req, res) => {
  try {
    req.body.updatedAt = new Date().getTime();
    const findData = await commonService.findOne(WareHouseModel, { _id: { $ne: req.body._id }, name: req.body.name, isDeleted: false });
    console.log({ findData })
    if (findData) {
      return sendErrorResponse(res, "This Warehouse Already Exists", HttpStatus.BAD_REQUEST);
    }
    // const wareHouseCity = await commonService.findOne(WareHouseModel, { _id: { $ne: req.body._id }, country: req.body.country, city: req.body.city });
    // if(wareHouseCity){
    //     return sendErrorResponse(res, "City is already added in other warehouse for this country", HttpStatus.BAD_REQUEST);
    // }
    let data;
    if (req.body?.subAdminId && findData?.subAdminId && (req.body?.subAdminId + "" == findData?.subAdminId + "")) {
      data = await commonService.findOneAndUpdate(WareHouseModel, req.body._id, req.body);
    } else {
      data = await commonService.findOneAndUpdate(WareHouseModel, req.body._id, req.body);
      if (findData?.subAdminId) {
        let updata = await commonService.findOneAndUpdate(SubAdminModel, findData?.subAdminId, { wareHouseId: null });
      }
    }
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const getWareHouse = async (req, res) => {
  try {
    // const data = await commonService.findListWithPopulate(WareHouseModel, { isDeleted: false },{},"subAdminId","adminId fullName email countryCode phoneNumber profilePic subAdminId moduleAccess address assignedCountry assignedCity", { createdAt: -1 });
    const data = await WareHouseModel.find({ isDeleted: false })
      .populate({ path: 'subAdminId', select: 'adminId fullName email countryCode phoneNumber profilePic subAdminId moduleAccess address assignedCountry assignedCity', options: { strictPopulate: false }, strictPopulate: false }).sort({ createdAt: -1 });
    // console.log(data)
    return sendSuccessResponse(res, data, success.LIST_FETCH, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const blockUnblockWareHouse = async (req, res) => {
  try {
    const data = await commonService.findOneAndUpdate(WareHouseModel, { _id: req.body._id }, { isBlocked: req.body.status });
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const deleteWareHouse = async (req, res) => {
  try {
    const findData = await commonService.findOne(WareHouseModel, { _id: req.body._id, isDeleted: false });
    if (findData && findData.subAdminId) {
      let updata = await commonService.findOneAndUpdate(SubAdminModel, findData.subAdminId, { wareHouseId: null });
    }
    const data = await commonService.findOneAndDelete(WareHouseModel, { _id: req.body._id });
    return sendSuccessResponse(res, data, success.DELETED_SUCCESS, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const fetchWareHouseByCountry = async (req, res) => {
  try {
    let { country, city } = req.body;
    let findData = {
      isDeleted: false
    }
    if (country && country != "") {
      findData = { ...findData, country: country }
    }
    if (city && city != "") {
      findData = { ...findData, city: city }
    }
    console.log({ findData });

    const data = await commonService.getAllByConditionFieldsBySorting(WareHouseModel, findData, { createdAt: -1 });

    return sendSuccessResponse(res, data, success.LIST_FETCH, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};