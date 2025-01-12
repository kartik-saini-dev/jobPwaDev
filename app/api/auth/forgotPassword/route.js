import connectToDB from "@/database"; // Importing DB connection
import {User} from "@/models/user"; // Importing User model
import Joi from "joi"; // For validation

import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server"; // For sending Next.js responses

// Joi schema for validation based on userType
const schema = Joi.object({
 
  email: Joi.string().email().required(),

});

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse the incoming request
    const {
      email,
     
    } = await req.json();

    // Validate the incoming data against the Joi schema
    const { error } = schema.validate({
      email,
    });
     

    // If validation fails, return the error message
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check if the user already exists by email
    const user = await User.findOne({ email });
      
     
    if (!user) {
      // Return an error if the email is already in use
      return NextResponse.json({
        success: false,
        message: "User does not  exists with this email.",
      });
    }

    
    const resetToken = user.getResetPasswordToken(); // the method we create in schema of user 

    await user.save(); 
  
    const resetPasswordUrl = `${process.env.BASE_URL}/resetPassword/?token=${resetToken}`;


 
        await sendEmail({
            url :resetPasswordUrl, 
            user
        });
       return NextResponse.json({
        success: true,
        message:
          " Check your email and Reset your password.",
        user,
        });
       
  } catch (error) {
   
    return NextResponse.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}
