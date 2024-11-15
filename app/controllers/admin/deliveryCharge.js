import * as commonService from "../../services/common/common.service";
import { success, error } from '../../responses/messages'
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response';
import DeliveryChargeModel from "./../../models/admin/deliveryCharge.model";
import HttpStatus from 'http-status-codes'

export const addDeliveryCharge = async (req, res) => {
  try {
    req.body.createdAt = new Date().getTime();
    const findData = await commonService.findOne(DeliveryChargeModel, { _id: { $ne: req.body._id },  country: req.body.country, isDeleted: false });
    if(findData){
      return sendErrorResponse(res, error.ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }
    const data = await commonService.create(DeliveryChargeModel, req.body);
    return sendSuccessResponse(res, data, success.CREATED, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const editDeliveryCharge = async (req, res) => {
  try {
    req.body.updatedAt = new Date().getTime();
    const findData = await commonService.findOne(DeliveryChargeModel, { _id: { $ne: req.body._id },  country: req.body.country, isDeleted: false });
    if(findData){
      return sendErrorResponse(res, error.ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }
    const data = await commonService.findOneAndUpdate(DeliveryChargeModel, { _id: req.body._id }, req.body);
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};
 
export const getDeliveryCharge = async (req, res) => {
  try {
    const data = await commonService.getAllByConditionFieldsBySorting(DeliveryChargeModel, { isDeleted: false }, { createdAt: -1 });
   
    return sendSuccessResponse(res, data, success.LIST_FETCH, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const blockUnblockDeliveryCharge = async (req, res) => {
  try {
    const data = await commonService.findOneAndUpdate(DeliveryChargeModel, { _id: req.body._id }, { isBlocked: req.body.status });
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const deleteDeliveryCharge = async (req, res) => {
  try {
    const data = await commonService.findOneAndDelete(DeliveryChargeModel, { _id: req.body._id });
    return sendSuccessResponse(res, data, success.DELETED_SUCCESS, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};