import * as userService from "../../services/user/user";
import {sendSuccessResponse,sendErrorResponse } from '../../responses/response'
import { Country, State, City } from 'country-state-city';

export const sendOtpCurrentMobileNumber = async (req, res) => {
  try {
    const resp = await userService.sendOtpCurrentMobileNumber(req.userData);
    if (resp.status == 1) {
      sendSuccessResponse(res,resp.data, resp.message,  200);
    } else {
      sendErrorResponse(res, resp.message, 403);
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const verifyOtpCurrentMobileNumber = async (req, res) => {
  try {
    const resp = await userService.verifyOtpCurrentMobileNumber(req.userData, req.body);
    if (resp.status == 1) {
      sendSuccessResponse(res,resp.response, resp.message, 200);
    } else {
      sendErrorResponse(res, resp.message, 403);
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const sendOtpForchangeMobileNumber = async (req, res) => {
    try {
      const resp = await userService.sendOtpForchangeMobileNumber(req.userData, req.body);
      if (resp.status == 1) {
        sendSuccessResponse(res, resp.data,resp.message, 200);
      } else {
        sendErrorResponse(res, resp.message, 403);
      }
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  };
  
  export const verifyOtpForchangeMobileNumber = async (req, res) => {
    try {
      const resp = await userService.verifyOtpForchangeMobileNumber(req.userData, req.body);
      if (resp.status == 1) {
        sendSuccessResponse(res,resp.data, resp.message, 200);
      } else {
        sendErrorResponse(res, resp.message, 403);
      }
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  };

  export const sendOtpCurrentEmail = async (req, res) => {
    try {
      const resp = await userService.sendOtpCurrentEmail(req.userData);
      if (resp.status == 1) {
        sendSuccessResponse(res,resp.data, resp.message, 200);
      } else {
        sendErrorResponse(res, resp.message, 403);
      }
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  };
 
  export const sendOtpForchangeEmail = async (req, res) => {
  try {
    const resp = await userService.sendOtpForchangeEmail(req.userData, req.body);
    if (resp.status == 1) {
      sendSuccessResponse(res,resp.data, resp.message, 200);
    } else {
      sendErrorResponse(res, resp.message, 403);
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const verifyOtpForchangeEmail = async (req, res) => {
  try {
    const resp = await userService.verifyOtpForchangeEmail(req.userData, req.body);
    if (resp.status == 1) {
      sendSuccessResponse(res,resp.data, resp.message, 200);
    } else {
      sendErrorResponse(res, resp.message, 403);
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const getCountryList = async (req, res) => {
  try {
    let countrys = await Country.getAllCountries()
    let dataToSend = {
        countryList: countrys
    }
    sendSuccessResponse(res, dataToSend, "All countries fetch",200);
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
    sendSuccessResponse(res,  dataToSend,"All cities fetch", 200);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};
