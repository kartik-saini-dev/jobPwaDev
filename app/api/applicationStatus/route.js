import connectToDB from "@/database"; // DB connection
import Application from "@/models/application"; // Application model
import Job from "@/models/job"; // Job model
import { NextResponse } from "next/server"; // Next.js response


export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse incoming job data from the request
    const { applicationId, action } = await req.json();

    // Find the application by its ID
    const existingApplication = await Application.findById(applicationId);

    if (!existingApplication) {
      return NextResponse.json({
        success: false,
        message: "Application not found.",
      });
    }

    // Check if the action is valid
    if (!["shortlisted", "hired", "rejected"].includes(action)) {
      return NextResponse.json({
        success: false,
        message: "Invalid action provided.",
      });
    }

    // Check if the application is already in the desired state
    if (existingApplication.status === action) {
      return NextResponse.json({
        success: false,
        message: `Application is already ${action}.`,
      });
    }

    // Update the application status
    existingApplication.status = action;
    await existingApplication.save();

    // Find the related job document
    const job = await Job.findById(existingApplication.job);

    if (!job) {
      return NextResponse.json({
        success: false,
        message: "Job not found.",
      });
    }

    // Update the specific application in the job's application array
    job.applications = job.applications.map((app) => {
      if (app.toString() === applicationId) {
        return existingApplication._id; // Replace with the updated application reference
      }
      return app;
    });

    // Save the updated job
    await job.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Application ${action} successfully.`,
    });
  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "An error occurred while processing the application. Please try again.",
    });
  }
}
