import connectToDB from "@/database"; // Import DB connection utility
import  Job  from "@/models/job"; // Import Job model
import { NextResponse } from "next/server"; // Import Next.js response utility
import { User } from "@/models/user"; // Import User model

export const dynamic = "force-dynamic"; // Ensure API is dynamic

export async function GET(req) {
  try {
    await connectToDB(); // Connect to the database

    const { searchParams } = new URL(req.url); // Extract URL params
    const jobId = searchParams.get("jobId");
           
    

    if (!jobId) {
      return NextResponse.json({
        success: false,
        message: "Job ID is required.",
      });
    }
    // Fetch the job by jobId and populate the recruiterId field with fullName and phone
    const job = await Job.findById(jobId).populate({
      path: "recruiterId", // The field to populate
      select: "fullName phone  email createdAt followers aboutCompany companyName",
    });
      
    
    // If the job is found, return the job data
    if (job) {
      return NextResponse.json({
        success: true,
        data: job,
      });
    }

    // If no job is found, return a 204 response
    return NextResponse.json({
      success: false,
      status: 204,
      message: "No job found with the provided jobId.",
    });

  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}
