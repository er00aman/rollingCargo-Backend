import { Joi } from "celebrate";

let admin = {
  LOGIN: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    deviceType: Joi.string().optional().allow(null, ""),
    deviceToken: Joi.string().optional().allow(null, ""),
  }),
  FORGET_PASSWRD: Joi.object().keys({
    email: Joi.string().required(),
  }),
  RESET_PASSWORD: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
  CREATE_SUB_ADMIN: Joi.object().keys({
    fullName: Joi.string().required(),
    countryCode: Joi.string().optional().allow(null, ""),
    phoneNumber: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    moduleAccess: Joi.array().required(),
    assignedCountry: Joi.string().required(),
    assignedCity: Joi.string().required(),
    wareHouseId: Joi.string().required(),
    address: Joi.string().required(),
  }),
  EDIT_SUB_ADMIN: Joi.object().keys({
    _id: Joi.string().required(),
    fullName: Joi.string().required(),
    countryCode: Joi.string().optional().allow(null, ""),
    phoneNumber: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    moduleAccess: Joi.array().required(),
    assignedCountry: Joi.string().required(),
    assignedCity: Joi.string().required(),
    wareHouseId: Joi.string().required(),
    address: Joi.string().required(),
  }),
  BLOCK_SUB_ADMIN: Joi.object().keys({
    isBlocked: Joi.number().required().allow(0),
  }),
  VERIFY_OTP: Joi.object().keys({
    otp: Joi.number().required(),
  }),
  FORGOT_PASSWORD: Joi.object().keys({
    email: Joi.string().required(),
  }),
  ADD_BANNER: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().required(),
    url: Joi.string().required(),
  }),
  ADD_CATEGORY: Joi.object().keys({
    name: Joi.string().required(),
    nameAr: Joi.string().required(),
    icon: Joi.string().required(),
  }), 
  ADD_LANGUAGE: Joi.object().keys({
    name: Joi.string().required(),
    nameAr: Joi.string().required(),
  }), 
  ADD_CITY: Joi.object().keys({
    city: Joi.object().keys({
      name: Joi.string().required(),
      address: Joi.string().allow("", null),
      coordinates: Joi.array(),
    }),
  }),  
  EDIT_FREELANCER: Joi.object().keys({
    status: Joi.number(),
    isFreelanceBlocked: Joi.bool(),
  }),
  REJECT_FREELANCER: Joi.object().keys({
    status: Joi.number().required(),
    rejectedReason: Joi.string().required(),
  }),
  BLOCK_UNBLOCK: Joi.object().keys({
    isBlocked: Joi.bool().required(),
  }),
  ADD_BENEFICIARY: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    contactNumber: Joi.number().required(),
    email: Joi.string().required(),
    profileImage: Joi.string().optional().allow(""),
  }),
  ADD_SUBSCRIPTION: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.string().required(),
    amount: Joi.number().required(),
    termsAndConditions: Joi.string().required(),
  }),
  EDIT_SUBSCRIPTION: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    duration: Joi.string(),
    amount: Joi.number(),
    termsAndConditions: Joi.string(),
    isBlocked: Joi.bool(),
  }),
  EDIT_TASK: Joi.object().keys({
    isBlocked: Joi.bool(),
    status: Joi.number(),
  }),
  ADD_EDIT_COMMISSION: Joi.object().keys({
    percentage: Joi.number().required(),
    userType: Joi.number().required(),
    termAndCondition: Joi.string().required(),
  }),
  SETTING_CMS: Joi.object().keys({
    type: Joi.number().required(),
    aboutUs: Joi.string().allow("", null),
    help: Joi.string().allow("", null),
    termAndCondition: Joi.string().allow("", null),
    privacyPolicy: Joi.string().allow("", null),
    contactDetail: Joi.object().keys({
      phoneNumber: Joi.string().allow("", null),
      countryCode: Joi.string().allow("", null),
      email: Joi.string().allow("", null),
      emailAr: Joi.string().allow("", null)
    }),
    legal: Joi.string().allow("", null),
    aboutUsAr: Joi.string().allow("", null),
    helpAr: Joi.string().allow("", null),
    termAndConditionAr: Joi.string().allow("", null),
    privacyPolicyAr: Joi.string().allow("", null),
    legalAr: Joi.string().allow("", null),
  }),
  SETTING_FAQ: Joi.object().keys({
    type: Joi.number().required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
    questionAr: Joi.string().required(),
    answerAr: Joi.string().required(),
  }),
  SEND_NOTIFICATION: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    allUserChecked: Joi.bool(),
    user_ids: Joi.array(),
  }),
  ADDBANNER: Joi.object().keys({
    title: Joi.string().required(),
    duration: Joi.number().required(),
    image: Joi.string().required(),
  }),
  EDITBANNER: Joi.object().keys({
    _id: Joi.string().required(),
    title: Joi.string().required(),
    duration: Joi.number().required(),
    image: Joi.string().required(),
  }),
  BLOCKBANNER: Joi.object().keys({
    _id: Joi.string().required(),
    status: Joi.boolean().required(),
  }),
  DELETEBANNER: Joi.object().keys({
    _id: Joi.string().required(),
  }),
  BLOCKUSER: Joi.object().keys({
    _id: Joi.string().required(),
    status: Joi.boolean().required(),
  }),
  CHANGEPASSWORD: Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
  SUB_ADMIN_ACTIVITY: Joi.object().keys({
    moduleName: Joi.string().required(),
  }),
  UPDATE_COMMISSION: Joi.object().keys({
    commision: Joi.number().required(),
  }),
  SEND_NOTIFICATION: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.number().required(),
    userIds: Joi.array().required()
  }),
  ADDCATEGORY: Joi.object().keys({
    name: Joi.string().required(),
  }),
  EDITCATEGORY: Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string().required(),
  }),
  BLOCKCATEGORY: Joi.object().keys({
    _id: Joi.string().required(),
    status: Joi.boolean().required(),
  }),
  DELETECATEGORY: Joi.object().keys({
    _id: Joi.string().required(),
  }),
  ADDDELIVERCHARGE: Joi.object().keys({
    country: Joi.string().required(),
    airFreight: Joi.object().keys({ 
      perKgCharge: Joi.number().required(), 
      handlingCharge: Joi.number().required(),
      minimumWeight: Joi.number().required(),
    }),
    seaFreight: Joi.object().keys({ 
      perKgCharge: Joi.number().required(), 
      handlingCharge: Joi.number().required(),
      minimumWeight: Joi.number().required(),
    }),
    taxPercent: Joi.number().required(),
  }),
  EDITDELIVERCHARGE: Joi.object().keys({
    _id: Joi.string().required(),
    country: Joi.string().required(),
    airFreight: Joi.object().keys({ 
      perKgCharge: Joi.number().required(), 
      handlingCharge: Joi.number().required(),
      minimumWeight: Joi.number().required(),
    }),
    seaFreight: Joi.object().keys({ 
      perKgCharge: Joi.number().required(), 
      handlingCharge: Joi.number().required(),
      minimumWeight: Joi.number().required(),
    }),
    taxPercent: Joi.number().required(),
  }),
  BLOCKDELIVERCHARGE: Joi.object().keys({
    _id: Joi.string().required(),
    status: Joi.boolean().required(),
  }),
  DELETEDELIVERCHARGE: Joi.object().keys({
    _id: Joi.string().required(),
  }),
  ADDCOUPON: Joi.object().keys({
    couponName: Joi.string().required(),
    couponCode: Joi.string().required(),
    description: Joi.string().optional().allow("", null),
    discountPercent: Joi.number().required(),
    validFrom: Joi.number().required(),
    validTill: Joi.number().required(),
  }),
  EDITCOUPON: Joi.object().keys({
    _id: Joi.string().required(),
    couponName: Joi.string().required(),
    couponCode: Joi.string().required(),
    description: Joi.string().optional().allow("", null),
    discountPercent: Joi.number().required(),
    validFrom: Joi.number().required(),
    validTill: Joi.number().required(),
  }),
  BLOCKCOUPON: Joi.object().keys({
    _id: Joi.string().required(),
    status: Joi.boolean().required(),
  }),
  DELETECOUPON: Joi.object().keys({
    _id: Joi.string().required(),
  }),
  ADDWAREHOUSE: Joi.object().keys({
    name: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    addressDetails: Joi.object().keys({
      buildingNumber: Joi.string().optional().allow("", null),
      streetNumber: Joi.string().optional().allow("", null),
      cityName: Joi.string().optional().allow("", null),
      zipCode: Joi.string().optional().allow("", null),
      address: Joi.string().optional().allow("", null),
      latitude: Joi.number().optional().allow(null),
      longitude: Joi.number().optional().allow(null),
    })
  }),
  EDITWAREHOUSE: Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    addressDetails: Joi.object().keys({
      buildingNumber: Joi.string().optional().allow("", null),
      streetNumber: Joi.string().optional().allow("", null),
      cityName: Joi.string().optional().allow("", null),
      zipCode: Joi.string().optional().allow("", null),
      address: Joi.string().optional().allow("", null),
      latitude: Joi.number().optional().allow(null),
      longitude: Joi.number().optional().allow(null),
    })
  }),
  BLOCKWAREHOUSE: Joi.object().keys({
    _id: Joi.string().required(),
    status: Joi.boolean().required(),
  }),
  DELETEWAREHOUSE: Joi.object().keys({
    _id: Joi.string().required(),
  }),
  FETCHWAREHOUSE: Joi.object().keys({
    country: Joi.string().optional().allow("", null),
    city: Joi.string().optional().allow("", null),
  }),
  CITY_LIST: Joi.object().keys({
    countryCode: Joi.string().required(),
  }),
  WAREHOUSE_CITY: Joi.object().keys({
    country: Joi.string().required(),
  }),
};

export default admin;
