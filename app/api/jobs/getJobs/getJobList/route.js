import connectToDB from "@/database"; // Import DB connection utility
import Job from "@/models/job"; // Import Job model
import { NextResponse } from "next/server"; // Import Next.js response utility
import {User} from "@/models/user"; // Import User model

export const dynamic = "force-dynamic"; // Ensure API is dynamic

export async function GET(req) {
  try {
    await connectToDB(); // Connect to the database

    const { searchParams } = new URL(req.url); // Extract URL params
    const recruiterId = searchParams.get("recruiterId");
   


    // Check if the user exists

    const userExist = await User.findById(recruiterId);
     

    if (!userExist) {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "User does not exist!",
      });
    }

    // Fetch jobs for the recruiter
    const userJobList = await Job.find({ recruiterId }).populate({
        path: "recruiterId",
        select: "fullName phone  email createdAt followers aboutCompany companyName",
      });

    if (userJobList.length > 0) {
      return NextResponse.json({
        success: true,
        data: userJobList,
      });
    }

    return NextResponse.json({
      success: false,
      status: 204,
      message: "No jobs found!",
    });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}
