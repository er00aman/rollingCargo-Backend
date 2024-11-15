import * as commonService from "../../services/common/common.service";
import { success, error } from '../../responses/messages'
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response';
import GoodsCategoryModel from "./../../models/admin/goodsCategory.model";
import HttpStatus from 'http-status-codes'

export const addGoodsCategory = async (req, res) => {
  try {
    req.body.createdAt = new Date().getTime();
    const findData = await commonService.findOne(GoodsCategoryModel, { name: req.body.name, isDeleted: false });
    if(findData){
      return sendErrorResponse(res, error.ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }
    const data = await commonService.create(GoodsCategoryModel, req.body);
    return sendSuccessResponse(res, data, success.CREATED, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const editGoodsCategory = async (req, res) => {
  try {
    req.body.updatedAt = new Date().getTime();
    const findData = await commonService.findOne(GoodsCategoryModel, { _id: { $ne: req.body._id }, name: req.body.name, isDeleted: false });
    if(findData){
      return sendErrorResponse(res, error.ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }
    const data = await commonService.findOneAndUpdate(GoodsCategoryModel, { _id: req.body._id }, req.body);
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};
 
export const getGoodsCategory = async (req, res) => {
  try {
    const data = await commonService.getAllByConditionFieldsBySorting(GoodsCategoryModel, { isDeleted: false }, { createdAt: -1 });
   
    return sendSuccessResponse(res, data, success.LIST_FETCH, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const blockUnblockGoodsCategory = async (req, res) => {
  try {
    const data = await commonService.findOneAndUpdate(GoodsCategoryModel, { _id: req.body._id }, { isBlocked: req.body.status });
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const deleteGoodsCategory = async (req, res) => {
  try {
    const data = await commonService.findOneAndDelete(GoodsCategoryModel, { _id: req.body._id });
    return sendSuccessResponse(res, data, success.DELETED_SUCCESS, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};