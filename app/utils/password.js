import bcrypt from "bcrypt";
require('dotenv').config();


export const generatePassword = async (pass) => {
    try {
      const saltRounds = parseInt(10);
      const salt = await bcrypt.genSalt(saltRounds);
      const genPass = await bcrypt.hash(pass, salt);
      return genPass;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

export const comparePassword = async (plainTextPassword, hashedPassword) => {
    try {
      let password =  await bcrypt.compare(plainTextPassword, hashedPassword);
      return password
    } catch (error) {
      console.log(error);
      return false;
    }
  };