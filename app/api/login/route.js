
import connectToDB from "@/database";
import { User } from "@/models/user"; // Assuming you have the User schema
import Joi from "joi";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// Validation schema for login
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().allow(""),
});



// Login Handler
export async function POST(req) {
  // Connect to database
  await connectToDB();

  // Extract email and password from request body
  const { email, password } = await req.json();

  // Validate the request data
  const { error } = schema.validate({ email, password });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    // Find the user in the database by email
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return NextResponse.json({
        success: false,
        message: "Account not found with this email",
      });
    }

    if (password) {
      // Validate the password
      const checkPassword = await bcrypt.compare(password, checkUser.password);
      if (!checkPassword) {
        return NextResponse.json({
          success: false,
          message: "Incorrect password. Please try again!",
        });
      }
    }

    // Update the user's online status in the database
    checkUser.online = true;
    await checkUser.save();

    // Generate JWT Token with user-specific info
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
        userType: checkUser.userType, // Include userType (worker/recruiter)
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    // Prepare response data based on user type (worker or recruiter)
    let userData = {
      email: checkUser.email,
      fullName: checkUser.fullName,
      _id: checkUser._id,
      online: checkUser.online,
    };

    // Additional recruiter-specific fields
    if (checkUser.userType === "recruiter") {
      userData = {
        ...userData,
        companyName: checkUser.companyName,
        companyWebsite: checkUser.companyWebsite,
        aboutCompany: checkUser.aboutCompany,
      };
    }

    // Return the final response including token and user data
    return NextResponse.json({
      success: true,
      token,
      message: "Login successful!",
      user: userData,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}
