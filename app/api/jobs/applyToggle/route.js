

import connectToDB from "@/database"; // DB connection
import Application from "@/models/application"; // Application model
import Job from "@/models/job"; // Job model
import { User } from "@/models/user"; // User model
import { NextResponse } from "next/server"; // Next.js response

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse the request body
    const { userId, jobId, action, recruiterId } = await req.json();

    // Validate the incoming data
    if (!userId || !jobId || !["apply", "unapply"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request. User ID, Job ID, and action are required.",
        },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Find the job in the database
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found.",
        },
        { status: 404 }
      );
    }

    // Handle the apply and unapply logic
    if (action === "apply") {
      // Check if the user has sufficient credits
      if (user.credits <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Insufficient credits to apply for this job.",
          },
          { status: 400 }
        );
      }

      // Check if the user has already applied for the job
      const existingApplication = await Application.findOne({ user: userId, job: jobId });
      if (existingApplication) {
        return NextResponse.json(
          {
            success: false,
            message: "You have already applied for this job.",
          },
          { status: 400 }
        );
      }

      // Deduct credit and create a new application
      user.credits -= 1;

      // Push the jobId into the user's appliedJobs array
      user.appliedJobs.push(jobId);
      await user.save();

      // Create a new application record
      const newApplication = new Application({ user: userId, job: jobId, recruiter: recruiterId });
      await newApplication.save();

      // Add the application ID to the job's applications array
      job.applications.push(newApplication._id);
      await job.save();

      return NextResponse.json({
        success: true,
        message: "Job application successful. Your credits have been updated.",
      });
    } else if (action === "unapply") {
      // Check if the user has already applied for the job
      const existingApplication = await Application.findOne({ user: userId, job: jobId });
      if (!existingApplication) {
        return NextResponse.json(
          {
            success: false,
            message: "You have not applied for this job.",
          },
          { status: 400 }
        );
      }

      // Remove the application
      await Application.deleteOne({ _id: existingApplication._id });

      // Remove the jobId from the user's appliedJobs array
      user.appliedJobs = user.appliedJobs.filter((id) => id.toString() !== jobId);
      user.credits += 1;
      await user.save();

      // Remove the application ID from the job's applications array
      job.applications = job.applications.filter((id) => id.toString() !== existingApplication._id.toString());
      await job.save();

      return NextResponse.json({
        success: true,
        message: "Job application withdrawn. Your credits have been updated.",
      });
    }
  } catch (error) {
    console.error("Error in job application route:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while processing your request. Please try again.",
    });
  }
}

