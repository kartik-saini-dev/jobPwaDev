import connectToDB from "@/database"; // Importing DB connection
import {User} from "@/models/user"; // Importing User model
import Joi from "joi"; // For validation
import bcrypt from "bcrypt"; // For hashing the password
import { NextResponse } from "next/server"; // For sending Next.js responses

// Joi schema for validation based on userType
const schema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(8).required(),
  userType: Joi.string().valid('employee', 'recruiter').required(), // employee or recruiter
  companyName: Joi.string().allow('').when('userType', {
    is: 'recruiter',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  companyWebsite: Joi.string().allow('').when('userType', {
    is: 'recruiter',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  aboutCompany: Joi.string().allow('').when('userType', {
    is: 'recruiter',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  resume: Joi.string().allow('').when('userType', {
    is: 'employee',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  avatar: Joi.object({
    public_id: Joi.string().required(),
    url: Joi.string().required(),
  }).optional(),

  portfolioURL: Joi.string().allow('').when('userType', {
    is: 'employee',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  githubURL: Joi.string().optional(),
  instagramURL: Joi.string().optional(),
  twitterURL: Joi.string().optional(),
  linkedInURL: Joi.string().optional(),
  facebookURL: Joi.string().optional(),
});


export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse the incoming request
    const {
      fullName,
      email,
      phone,
      password,
      userType,
      companyName,
      companyWebsite,
      aboutCompany,
      resume,
      avatar,
      portfolioURL,
      githubURL,
      instagramURL,
      twitterURL,
      linkedInURL,
      facebookURL,
    } = await req.json();

    // Validate the incoming data against the Joi schema
    const { error } = schema.validate({
      fullName,
      email,
      phone,
      password,
      userType,
      companyName,
      companyWebsite,
      aboutCompany,
      resume,
      avatar,
      portfolioURL,
      githubURL,
      instagramURL,
      twitterURL,
      linkedInURL,
      facebookURL,
    });
 
    // If validation fails, return the error message
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Return an error if the email is already in use
      return NextResponse.json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user based on the provided data
    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      userType,
      companyName: userType === "recruiter" ? companyName : undefined,
      companyWebsite: userType === "recruiter" ? companyWebsite : undefined,
      aboutCompany: userType === "recruiter" ? aboutCompany : undefined,
      resume: userType === "employee" ? resume : undefined,
      avatar,
      portfolioURL: userType === "employee" ? portfolioURL : undefined,
      githubURL: userType === "employee" ? githubURL : undefined,
      instagramURL,
      twitterURL,
      linkedInURL,
      facebookURL,
    });
     
    // If the user is successfully created, send a success response
    return NextResponse.json({
      success: true,
      message: "User registered successfully.",
      data: newUser,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}
