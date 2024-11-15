import * as commonService from "../../services/common/common.service";
import { success, error } from '../../responses/messages'
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response';
import CouponModel from "./../../models/admin/coupon.model";
import HttpStatus from 'http-status-codes'

export const addCoupon = async (req, res) => {
  try {
    req.body.createdAt = new Date().getTime();
    const couponData = await commonService.findOne(CouponModel, { couponCode: req.body.couponCode });
    if (couponData) {
      return sendErrorResponse(res, error.ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }
    const data = await commonService.create(CouponModel, req.body);
    return sendSuccessResponse(res, data, success.CREATED, HttpStatus.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const editCoupon = async (req, res) => {
  try {
    req.body.updatedAt = new Date().getTime();
    const findData = await commonService.findOne(CouponModel, { _id: { $ne: req.body._id }, couponCode: req.body.couponCode, isDeleted: false });
    if (findData) {
      return sendErrorResponse(res, error.ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }
    const data = await commonService.findOneAndUpdate(CouponModel, { _id: req.body._id }, req.body);
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const getCoupon = async (req, res) => {

  try {
    const data = await commonService.getAllByConditionFieldsBySorting(CouponModel, { isDeleted: false }, { createdAt: -1 });

    return sendSuccessResponse(res, data, success.LIST_FETCH, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const blockUnblockCoupon = async (req, res) => {
  try {
    const data = await commonService.findOneAndUpdate(CouponModel, { _id: req.body._id }, { isBlocked: req.body.status });
    return sendSuccessResponse(res, data, success.UPDATED, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const data = await commonService.findOneAndDelete(CouponModel, { _id: req.body._id });
    return sendSuccessResponse(res, data, success.DELETED_SUCCESS, HttpStatus.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};