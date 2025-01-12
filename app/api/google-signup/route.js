import connectToDB from "@/database"; // Importing DB connection
import {User} from "@/models/user"; // Importing User model
import { NextResponse } from "next/server"; // For sending Next.js responses
import jwt from "jsonwebtoken"; // For generating JWT token



// Helper function to create JWT token
const createJWT = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Google sign-up handler
export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse the incoming request data
    const { fullName, email, avatar,userType } = await req.json();
              


    // Check if the user with the given email already exists
    const userExist = await User.findOne({ email });

    // If the user exists, return an error message
    if (userExist) {
      return NextResponse.json({
        success: false,
        message: "Email Address already exists. Try Login.",
      });
    }

    // Create a new user with the Google data
    const user = await User.create({
      fullName,
      email,
      avatar,
      online:true,
      userType, // Defaulting to worker or you can set this conditionally
    });

    // Remove password from user object before sending it to the client
    user.password = undefined;

    // Generate JWT token for the user
    const token = createJWT(user?._id);

    // Send a success response with the user info and the JWT token
    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user,
      token,
    });

  } catch (error) {
  
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong during Google Sign-Up.",
    });
  }
}
