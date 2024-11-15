import * as commonService from "../../services/common/common.service";
import { success, error } from '../../responses/messages'
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response';
import BannerModel from "./../../models/admin/banner.model";
import HttpStatus from 'http-status-codes'

export const addBanner = async (req, res) => {
  try {
    req.body.createdAt = new Date().getTime();
    const data = await commonService.create(BannerModel, req.body);
    return sendSuccessResponse(res, data, success.CREATED, HttpStatus.OK);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const editBanner = async (req, res) => {
  try {
    req.body.updatedAt = new Date().getTime();

    const data = await commonService.findOneAndUpdate(BannerModel, { _id: req.body._id }, req.body);
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};
 
export const getBanner = async (req, res) => {
  try {
    const data = await commonService.getAllByConditionFieldsBySorting(BannerModel, { isDeleted: false }, { createdAt: -1 });
   
    return sendSuccessResponse(res, data, success.LIST_FETCH, HttpStatus.OK);

  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const blockUnblockBanner = async (req, res) => {
  try {
    const data = await commonService.findOneAndUpdate(BannerModel, { _id: req.body._id }, { isBlocked: req.body.status });
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const data = await commonService.findOneAndDelete(BannerModel, { _id: req.body._id });
    return sendSuccessResponse(res, data, success.DELETED_SUCCESS, HttpStatus.OK);

  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};