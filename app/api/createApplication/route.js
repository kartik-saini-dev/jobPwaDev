import connectToDB from "@/database"; // DB connection
import Application from "@/models/application"; // Job model
import Job from "@/models/job"; 
import { NextResponse } from "next/server"; // Next.js response



export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse incoming job data from the request
    const {
      userId, recruiterId, jobId
    } = await req.json();

    // Check if the application already exists
    const existingApplication = await Application.findOne({
      user: userId,
      job: jobId,
    });

    if (existingApplication) {
      return NextResponse.json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // Create the job entry in the database
    const newApplication = await Application.create({
      user: userId,
      job: jobId,
      recruiter: recruiterId,
    });

    // Update the job document to include the new application
    await Job.findByIdAndUpdate(jobId, { $push: { applications: newApplication._id } });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Applied successfully.",
    });
  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "An error occurred while applying for the job. Please try again.",
    });
  }
}
