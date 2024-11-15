import jwt from "jsonwebtoken";
require("dotenv").config();

import AdminModel from "../models/admin/admin.model";
import UserModel from "../models/user/user.model";

import { db } from "../config/index";
import SubAdminModel from "../models/admin/subAdmin";


export const verifyAdminToken = async (req, res, next) => {
  // console.log(req.headers)
  let { accesstoken } = req.headers;
  // console.log("Admin Token : : ",accesstoken)
  if (!accesstoken)
    return res.status(403).send({
      auth: false,
      message: "No token Provided",
    });

  jwt.verify(
    accesstoken,
    db.SECRET_KEY,
    async function (err, decoded) {
      if (!err) {
        let admin = await AdminModel.findOne({ accessToken: accesstoken });
        if (!admin) {
          admin = await SubAdminModel.findOne({ accessToken: accesstoken });
        }
        if (!admin) {
          res.status(403).json({ message: "Invalid Access Token" });
          return;
        }
        req.adminData = admin;
        next();
      } else {
        return res
          .status(403)
          .json({ auth: false, message: "Token has been expired" });
      }
    }
  );
};

export const verifyUserToken = async (req, res, next) => {
  try {
    let { accesstoken } = req.headers;
    if (!accesstoken) return res.status(403).send({ auth: false, message: "No token Provided" });

    jwt.verify(
      accesstoken,
      db.SECRET_KEY,
      async function (err, decoded) {
        if (!err) {
          req.tokenUser = JSON.parse(JSON.stringify(decoded));
          if (req.route.path.includes("/verifyOtp") || req.route.path.includes("/resendOtp")) {
            next()
            return
          }
          let user = await UserModel.findOne({ accessToken: accesstoken });
          if (!user) {
            res.status(401).json({ message: "Session expired" });
            return;
          }
          if (user.isBlocked == true) {
            let updateSalesman = await UserModel.findOneAndUpdate({ _id: user._id }, { $set: { accessToken: null } });
            return res.status(403).json({ message: "Your account has been blocked by admin" });
          }
          req.userData = user;
          next();
        } else {
          return res
            .status(403)
            .json({ auth: false, message: "Token has been expired" });
        }
      }
    );
  } catch (err) {
    return res
      .status(401)
      .json({ auth: false, message: (err?.message || "Token has been expired") });
  }
};


async function findUser(accesstoken) {
  try {
    let user = await UserModel.findOne({ accessToken: accesstoken });
    if (!user) {
      return {
        status: 0,
        data: {},
      };
    }
    return {
      status: 1,
      data: user,
    };
  } catch (error) {
    return {
      status: 0,
      error: error,
    };
  }
}

//Admin Token
async function findAdmin(accesstoken) {
  try {
    let user = await AdminModel.findOne({ accessToken: accesstoken });
    if (!user) {
      return {
        status: 0,
        data: {},
      };
    }
    return {
      status: 1,
      data: user,
    };
  } catch (error) {
    return {
      status: 0,
      error: error,
    };
  }
}

export const verifyUserLogin = async (req, res, next) => {
  if (req.userData) {
    next();
  } else {
    return res
      .status(403)
      .json({ auth: false, message: "Unauthorized user/User not Loged in" });
  }
};

