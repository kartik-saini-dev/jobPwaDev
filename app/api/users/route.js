import connectToDB from "@/database"; // DB connection
import { User } from "@/models/user"; // User model
import Job  from "@/models/job"; // Job model
import { NextResponse } from "next/server"; // Next.js response

// Enable dynamic fetching
export const dynamic = "force-dynamic";

// API handler for GET requests
export async function GET(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Extract the userId from the request query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    // Fetch user details, populate followers and following, and exclude the password
    const user = await User.findById(userId)
      .populate("followers.userId", "fullName avatar") // Populate followers with specific fields
      .populate("following.userId", "fullName avatar") // Populate following with specific fields
      .select("-password"); // Exclude password from the response

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Prepare the base response data
    const responseData = {
      fullName: user.fullName,
      email: user.email,
      credits: user.credits,
      followers: user.followers,
      following: user.following,
      savedJobsCount: user.appliedJobs.length, // Count the saved jobs
      avatar: user.avatar,
      userType: user.userType,
      description: user?.description,
    };

    // Add userType-specific data
    if (user.userType === "employee") {
      responseData.portfolioURL = user.portfolioURL || null;
      responseData.resume = user.resume || null;
      responseData.githubURL = user.githubURL || null;
    } else if (user.userType === "recruiter") {
      responseData.companyName = user.companyName || null;
      responseData.companyWebsite = user.companyWebsite || null;
      responseData.aboutCompany = user.aboutCompany || null;
      responseData.recruiterId= user._id || null;
      // Fetch the count of jobs posted by the recruiter
      const jobCount = await Job.countDocuments({ recruiterId: userId });
      responseData.postedJobsCount = jobCount; // Add the job count
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching user information.",
      },
      { status: 500 }
    );
  }
}
