import sgMail from "@sendgrid/mail";
import { db } from "../config/index";

sgMail.setApiKey(db.SEND_GRID_KEY);

export const sendEmail = async ({ toEmail, subject, text, html }) => {
  const msg = {
    to: toEmail,
    from: db.EMAIL,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    let response = await sgMail.send(msg);
    console.log("mail response ", response)
    return {
      success: true,
      error: "",
    };
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    };
  }
};
