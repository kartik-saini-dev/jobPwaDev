
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;
  
        // in order to use sandbox for email verification
        // var transport = nodemailer.createTransport({
        //     host: "sandbox.smtp.mailtrap.io",
        //     port: 2525,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //       user: "......",
        //       pass: "...." 
        //     }
        //   });

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD// go to google account security then 2 step verification then app password then  app name is nodemailer 
  },
  tls: {
    rejectUnauthorized: false // Add this to allow self-signed certificates
  }

});

export const sendEmail = async ({user, url}) => {
  const { _id, email, fullName } = user;

  //   mail options
  const mailOptions = {
    from: `${AUTH_EMAIL}`,
    to: email,
    subject: "Reset Your Password",
    html: `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: #444; background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
      <h2 style="color: #0842a0; text-align: center;">Password Reset Request</h2>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="line-height: 1.6;">
        Hello <strong>${fullName}</strong>,
      </p>
      <p style="line-height: 1.6;">
        We received a request to reset your password. Click the button below to reset it:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${url}" style="text-decoration: none; background-color: #0842a0; color: #ffffff; padding: 12px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="line-height: 1.6;">
        If the button above doesn't work, copy and paste the following link into your browser:
      </p>
      <p style="word-break: break-all; color: #0842a0; text-align: center;">
        <a href="${url}" style="color: #0842a0; text-decoration: underline;">${url}</a>
      </p>
      <p style="line-height: 1.6; margin-top: 30px;">
        Please note, this link will expire in <strong>2 minutes</strong>.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="font-size: 14px; color: #666; text-align: center;">
        Regards,<br>
        <strong>JobPwa Team</strong>
      </p>
    </div>`,
  };

  try {
     

    
      await transporter.sendMail(mailOptions);
  
     

  } catch (error) {
      

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    return NextResponse.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
