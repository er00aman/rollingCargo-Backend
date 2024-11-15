import { Joi } from "celebrate";

let user = {
  REGISTER: Joi.object().keys({
    name: Joi.string().required(),
    countryCode: Joi.string().required(),
    countryIsoCode: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    email: Joi.string().required(),
    country: Joi.string().optional().allow(null, ""),
    city: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    deviceType: Joi.number().optional().allow(null, 0),
    deviceToken: Joi.string().optional().allow(null, ""),
    // latitude: Joi.number().optional().allow(null, 0),
    // longitude: Joi.number().optional().allow(null, 0),
  }),
  LOGIN: Joi.object().keys({
    countryCode: Joi.string().optional().allow(null, ""),
    phoneNumber: Joi.number().optional().allow(null, ""),
    email: Joi.string().optional().allow(null, ""),
    password: Joi.string().required(),
    deviceType: Joi.number().optional().allow(null, 0),
    deviceToken: Joi.string().optional().allow(null, ""),
    // latitude: Joi.number().optional().allow(null, 0),
    // longitude: Joi.number().optional().allow(null, 0),
  }),
  VERIFY_OTP: Joi.object().keys({
    otp: Joi.number().required(),
  }),
  UPDATE_PROFILE: Joi.object().keys({
    _id: Joi.string().required(),
    businessName: Joi.string().required(),
    name: Joi.string().optional().allow(null, ""),
    email: Joi.string().optional().allow(null, ""),
    address: Joi.string().required(),
    channelId: Joi.string().required(),
    latitude: Joi.number().optional().allow(null, 0),
    longitude: Joi.number().optional().allow(null, 0),
  }),
  CHANGEMOBILENUMBAER: Joi.object().keys({
    countryCode: Joi.string().required(),
    mobileNumber: Joi.string().required(),
  }),
  FORGET_PASSWRD: Joi.object().keys({
    countryCode: Joi.string().required(),
    phoneNumber: Joi.number().required()
  }),
  RESET_PASSWORD: Joi.object().keys({
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
  CHANGEEMAIL: Joi.object().keys({
    email: Joi.string().required(),
  }),
  CITY_LIST: Joi.object().keys({
    countryCode: Joi.string().required(),
  }),
  APPLY_COUPON: Joi.object().keys({
    amount: Joi.number().required(),
    couponCode: Joi.string().required(),
  }),
  CALCULATE_SHIPMENT: Joi.object().keys({
    shippingMode: Joi.number().required(),
    sendingCountry: Joi.string().required(),
    sendingCity: Joi.string().required(),
    receivingCountry: Joi.string().required(),
    receivingCity: Joi.string().required(),
    goodsType: Joi.string().required(),
    goodsWeight: Joi.number().optional().allow(null, "", 0),
    goodsLength: Joi.number().optional().allow(null, "", 0),
    goodsWidth: Joi.number().optional().allow(null, "", 0),
    goodsHeight: Joi.number().optional().allow(null, "", 0),
    // goodsDescription: Joi.string().optional().allow(null, ""),
    // receiverName: Joi.string().optional().allow(null, ""),
    // receiverMobileNo: Joi.string().optional().allow(null, ""),
    // receiverAddress: Joi.string().optional().allow(null, ""),
  }),
  CHECK_VALID_COUNTRY_ORDER: Joi.object().keys({
    shippingMode: Joi.number().required(),
    sendingCountry: Joi.string().required(),
    sendingCity: Joi.string().required(),
    receivingCountry: Joi.string().required(),
    receivingCity: Joi.string().required(),
    goodsType: Joi.string().required(),
    goodsWeight: Joi.number().optional().allow(null, "", 0),
    goodsLength: Joi.number().optional().allow(null, "", 0),
    goodsWidth: Joi.number().optional().allow(null, "", 0),
    goodsHeight: Joi.number().optional().allow(null, "", 0),
    goodsImages: Joi.array().required(),
    goodsDescription: Joi.string().optional().allow(null, ""),
    receiverName: Joi.string().optional().allow(null, ""),
    receiverMobileNo: Joi.string().optional().allow(null, ""),
    receiverAddress: Joi.string().optional().allow(null, ""),
  }),
  PLACE_ORDER: Joi.object().keys({
    orderType: Joi.number().required(),
    shippingMode: Joi.number().required(),
    sendingCountry: Joi.string().required(),
    sendingCity: Joi.string().required(),
    receivingCountry: Joi.string().required(),
    receivingCity: Joi.string().required(),
    couponId: Joi.string().optional().allow(null, ""),
    goodsType: Joi.string().optional().allow(null, ""),
    goodsWeight: Joi.number().optional().allow(null, "", 0),
    goodsLength: Joi.number().optional().allow(null, "", 0),
    goodsWidth: Joi.number().optional().allow(null, "", 0),
    goodsVolume: Joi.number().optional().allow(null, "", 0),
    goodsHeight: Joi.number().optional().allow(null, "", 0),
    goodsQuotationRequestId: Joi.string().optional().allow(null, ""),
    goodsDescription: Joi.string().required(),
    receiverName: Joi.string().required(),
    // deliveryType: Joi.number().required(),
    receiverMobileNo: Joi.string().required(),
    receiverAddress: Joi.object({
      houseBuilding: Joi.string().allow('').default(''),
      street: Joi.string().allow('').default(''),
      area: Joi.string().allow('').default(''),
      city: Joi.string().allow('').default(''),
      zipCode: Joi.string().allow('').default(''),
    }).required(),
    // receiverAddress: Joi.string().required(),
    totalAmount: Joi.number().required(),
    taxAmount: Joi.number().required(),
    discountAmount: Joi.number().optional().allow(null, "", 0),
    repackagePrice: Joi.number().optional().allow(null, "", 0),
    shippingPrice: Joi.number().optional().allow(null, "", 0),
    isRepackaging: Joi.number().optional().allow(null, "", 0),
    transactionId: Joi.string().required(),
    paymentOptions: Joi.string().required(),
    goodsImages: Joi.array().required(),
    paymentResponse: Joi.array().optional().default([]),
  }),
  SEND_LARGE_GOODS: Joi.object().keys({
    shippingMode: Joi.number().required(),
    sendingCountry: Joi.string().required(),
    sendingCity: Joi.string().required(),
    receivingCountry: Joi.string().required(),
    receivingCity: Joi.string().required(),
    goodsWeight: Joi.number().required(),
    goodsImages: Joi.array().required(),
    goodsDescription: Joi.string().optional().allow(null, ""),
    receiverName: Joi.string().optional().allow(null, ""),
    receiverMobileNo: Joi.string().optional().allow(null, ""),
    isRepackaging: Joi.number().required().allow(0),
  }),
  EXPORT_GOODS: Joi.object().keys({
    shippingMode: Joi.number().required(),
    sendingCountry: Joi.string().required(),
    sendingCity: Joi.string().required(),
    receivingCountry: Joi.string().required(),
    goodsWeight: Joi.number().required(),
    goodsImages: Joi.array().required(),
    goodsDescription: Joi.string().optional().allow(null, ""),
    receiverName: Joi.string().optional().allow(null, ""),
    receiverMobileNo: Joi.string().optional().allow(null, ""),
    exportAddress: Joi.object().keys({
      houseNumber: Joi.string().optional().allow(null, ""),
      streetNumber: Joi.string().optional().allow(null, ""),
      streetName: Joi.string().optional().allow(null, ""),
      city: Joi.string().optional().allow(null, ""),
      zipCode: Joi.string().optional().allow(null, ""),
    }),
    isRepackaging: Joi.number().required().allow(0),
  }),
  DELIVERY_CHARGE: Joi.object().keys({
    country: Joi.string().required(),
  }),

  REVIEW: Joi.object().keys({
    orderId: Joi.string().required().messages({
      'any.required': 'Order ID is required',
      'string.empty': 'Order ID cannot be empty',
    }),
    rating: Joi.number().min(1).max(5).required().messages({
      'any.required': 'Rating is required',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
    }),
    comment: Joi.string().min(5).max(500).required().messages({
      'any.required': 'Comment is required',
      'string.min': 'Comment should be at least 5 characters long',
      'string.max': 'Comment should be at most 500 characters long',
    })
  }),
  AFTER_CALCULATE_SHIPMENT: Joi.object().keys({
    shippingMode: Joi.number().required(),
    shippingType: Joi.number().required(),
    sendingCountry: Joi.string().required(),
    sendingCity: Joi.string().required(),
    receivingCountry: Joi.string().required(),
    receivingCity: Joi.string().required(),
    goodsType: Joi.string().required(),
    goodsWeight: Joi.number().optional().allow(null, "", 0),
    goodsLength: Joi.number().optional().allow(null, "", 0),
    goodsWidth: Joi.number().optional().allow(null, "", 0),
    goodsHeight: Joi.number().optional().allow(null, "", 0),
    goodsDescription: Joi.string().optional().allow(null, ""),
    receiverName: Joi.string().optional().allow(null, ""),
    receiverMobileNo: Joi.string().optional().allow(null, ""),
    goodsImages: Joi.array().required(),
    isRepackaging: Joi.number().required().allow(0),
    calculatedAmount: Joi.number().required(),
    taxAmount: Joi.number().required(),
  }),
  SHIPMENT_DETAILS: Joi.object().keys({
    shipmentId: Joi.string().required(),
  }),
  ORDER_DETAILS: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
  UPDATE_ADDRESS: Joi.object().keys({
    orderId: Joi.string().required(),
    address: Joi.string().required(),
  }),
  TRACK_ORDER: Joi.object().keys({
    orderNumber: Joi.string().required(),
  }),
  UPDATE_ORDER_STATUS: Joi.object().keys({
    orderId: Joi.string().required(),
    status: Joi.number().required(),
  }),
};

export default user;
