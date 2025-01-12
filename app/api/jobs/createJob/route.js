import connectToDB from "@/database"; // DB connection
import Job from "@/models/job"; // Job model
import Joi from "joi"; // For validation
import { NextResponse } from "next/server"; // Next.js response

// Joi schema for job validation
const jobSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  companyName: Joi.string().required(),
  jobType: Joi.string().required(),
  industry: Joi.string().required(),
  responsibilities: Joi.array().items(Joi.string()).required(), // Array of responsibilities
  requirements: Joi.array().items(Joi.string()).optional(), // Array of requirements
  salary: Joi.number().required(),
  experience: Joi.number().required(),
  skillsRequired: Joi.array().items(Joi.string()).optional(), // Array of skills required
  benefits: Joi.array().items(Joi.string()).optional(), // Array of benefits
  images: Joi.array().items(Joi.string()).optional(), // Array of image URLs
  deadline: Joi.date().optional(),
  recruiterId: Joi.string().required(), // recruiterId is mandatory
});



export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse incoming job data from the request
    const {
      title,
      category,
      description,
      responsibilities,
      requirements,
      salary,
      experience,
      companyName,
      jobType,
      industry,
      skillsRequired,
      benefits,
      images,
      deadline,
      recruiterId,
    } = await req.json();

    // Validate the job data using Joi
    const { error } = jobSchema.validate({
      title,
      category,
      description,
      responsibilities,
      requirements,
      salary,
      experience,
      companyName,
      jobType,
      industry,
      skillsRequired,
      benefits,
      images,
      deadline,
      recruiterId,
    });

    // If validation fails, return an error message
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Create the job entry in the database
    const newJob = await Job.create({
      title,
      category,
      description,
      responsibilities,
      requirements,
      salary,
      experience,
      companyName,
      jobType,
      industry,
      skillsRequired,
      benefits,
      images,
      deadline,
      recruiterId,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Job created successfully.",
      data: newJob,
    });
  } catch (error) {
   
    return NextResponse.json({
      success: false,
      message: "An error occurred while creating the job. Please try again.",
    });
  }
}
