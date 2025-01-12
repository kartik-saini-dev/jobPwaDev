import connectToDB from "@/database"; // DB connection
import Application from "@/models/application"; // Application model
import { NextResponse } from "next/server"; // Next.js response

// Make the route dynamic
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDB();
  

    // Parse incoming job data from the request
    const { searchParams } = new URL(req.url); // Extract URL params
    const userId = searchParams.get('userId'); // Get userId
    const jobId = searchParams.get('jobId'); // Get jobId

    // Check if userId and jobId are provided
    if (!userId || !jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and Job ID are required.",
        },
        { status: 400 } // Bad Request
      );
    }

    // Find applied jobs in the database
    const appliedJobs = await Application.find({
      user: userId,
      job: jobId,
    });

    // Check if any applications exist
    if (appliedJobs.length > 0) {
      // Return success response with the applied jobs data
      return NextResponse.json({
        success: true,
        data: appliedJobs, // Return the list of applied jobs
      });
    } else {
      // Return response indicating no applied jobs found
      return NextResponse.json({
        success: false,
        message: "No applied jobs found for this user and job.",
      });
    }
  } catch (error) {
  
    return NextResponse.json({
      success: false,
      message: "An error occurred while finding applied jobs. Please try again.",
    });
  }
}

