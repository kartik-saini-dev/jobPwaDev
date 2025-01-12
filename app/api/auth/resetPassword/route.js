import connectToDB from "@/database"; // Importing DB connection
import { User } from "@/models/user"; // Importing User model
import crypto from "crypto"; // For hashing the token
import Joi from "joi"; // For validation
import { NextResponse } from "next/server"; // For sending Next.js responses
import bcrypt from "bcrypt"; 

// Joi schema for validating the passwords
const schema = Joi.object({
  password: Joi.string().min(6).required(),
//   confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
//     'any.only': 'Password and Confirm Password do not match',
//   }),
});



export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    
    const { password, token } = await req.json();
        
 

    // Validate the incoming data against the Joi schema
    const { error } = schema.validate({ password });

    if (error) {
      // Return validation error message
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Hash the token and search for the user
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token must still be valid
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      // Return an error if the token is invalid or expired
      return NextResponse.json({
        success: false,
        message: "Reset password token is invalid or has expired.",
      });
    }

    // Update the user's password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpire = undefined; // Clear the expiration

    // Save the updated user data
    await user.save();

    // Respond with success
    return NextResponse.json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    // Handle errors and send failure response
    return NextResponse.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}
