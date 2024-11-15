import mail from 'nodemailer';
import { renderFile } from 'ejs';
import multer from 'multer';

/* email */
// SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
// SMTP_PORT=587
// SMTP_USER=AKIATTBTE6M7YE4L25FJ
// SMTP_PASS=BJXLbRkleBfRjpq4JI1fNBKyQYN73qWt+S+c7A5bJ3Kl
// SMTP_EMAIL=support@onroad.com

exports.generateOtp = async(digit) => {
  const otp = Math.floor(
    10 ** (digit - 1) + Math.random() * (10 ** (digit - 1) * 9)
  );
  return otp;
};

const transporter = mail.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendMail = (email, sendData, subject, textTemplate) => {
  try {
    renderFile(`${appRoot}/app/public/mailTemplate/${textTemplate}`, sendData, (err, dataTemplate) => {
      if (err) {
        console.log(err);
      } else {
        const mainOptions = {
          from: process.env.SMTP_EMAIL,
          to: email,
          subject,
          html: dataTemplate
        };
        transporter.sendMail(mainOptions, (info) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getPagination = (page, size) => {
  const limit = size || 10;
  const skip = page ? (page - 1) * limit : 0;
  return { skip, limit };
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb({ code: 'WRONG_FILE_TYPE', field: file.fieldname }, false);
  }
};

exports.uploadFile = (name) => async (req, res, next) => {
  const upload = multer({ fileFilter, limits: { fileSize: 10000000 } }).single(name);
  upload(req, res, (error) => {
    if (error) {
      return response.error(req, res, { msgCode: error.code, data: error.field }, 403);
    }
    next();
  });
};

exports.optionalValidation = (req, res, next) => {
  if (req.headers.authorization) {
    verifyAuthToken(req, res, next);
  } else {
    next();
  }
};

// // Function to capitalize First Letter of String
exports.capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to generate a random number between min and max (inclusive)
// export const generateRandomNumber = (min, max) => {
//   console.log(Math.floor(Math.random() * (max - min + 1)) + min)
// return Math.floor(Math.random() * (max - min + 1)) + min;
// };

 // Function to check if a value is a valid email address
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to check if a value is a valid phone number
exports.isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number
  return phoneRegex.test(phoneNumber);
};

// Function to generate a random string of given length
exports.generateRandomString = (length) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

// Function to generate a random string of given length
exports.generateRandomNumber = (length) => {
  const characters = '0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  console.log(randomString)
  return randomString;
};

// Function to get the current date and time
exports.getCurrentDateTime = () => {
  return new Date().toISOString();
};

// Function to convert milliseconds to a human-readable format (e.g., "1h 30m 20s")
exports.msToHumanReadable = (milliseconds) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return parts.join(' ');
};

// Function to remove duplicates from an array
exports.removeDuplicatesFromArray = (array) => {
  return [...new Set(array)];
};

// Function to shuffle an array
exports.shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const randomStringGenerator = () => {
  return Math.floor(1000 + Math.random() * 9000);
};