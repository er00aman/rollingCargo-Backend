
import HttpStatus from 'http-status-codes'
import * as commonService from '../../services/common/common.service';
import UserModel from '../../models/user/user.model';
import { success, error } from '../../responses/messages'
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response'


export const fetchList = async(req,res)=>{
    try {
        const userList = await commonService.getAllByConditionFieldsWithProjectionAndSorting(UserModel, {isDeleted: false}, { accessToken: 0,password:0, otp: 0 }, {_id : -1})
        if(userList){
            return sendSuccessResponse(res, userList, success.LIST_FETCH, HttpStatus.OK)
        }
        return sendSuccessResponse(res, userList, error.LIST_FETCH, HttpStatus.OK)
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};

export const blockUnblock=async(req,res)=>{
    try {
        let {isBlocked,userId}=req.body
        const user = await commonService.updateByCondition(UserModel, {_id:userId},  {isBlocked:isBlocked})
        if(user){
            return sendSuccessResponse(res, null, success.UPDATED, HttpStatus.OK)
        }
        return sendSuccessResponse(res, {}, error.NOT_FOUND, HttpStatus.OK)
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.SOMETHING_WRONG);
    }
};