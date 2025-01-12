import connectToDB from "@/database"; // DB connection
import Job from "@/models/job"; // Job model
import Application from "@/models/application"; // Application model
import { NextResponse } from "next/server"; // Next.js response

// Enable dynamic fetching
export const dynamic = "force-dynamic";

// API handler for GET requests
export async function GET(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch jobs with recruiter information
    const jobs = await Job.find({}).populate({
      path: "recruiterId",
      select: "fullName", // Include recruiter's full name
    });

    // Prepare enhanced job data with application stats
    const enhancedJobs = await Promise.all(
      jobs.map(async (job) => {
        // Aggregate application data for the job
        const applicationStats = await Application.aggregate([
          { $match: { job: job._id } }, // Match applications for the current job
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]);

        // Calculate total applications
        const totalApplications = await Application.countDocuments({ job: job._id });

        // Extract shortlisted and hired counts
        const shortlistedCount =
          applicationStats.find((stat) => stat._id === "shortlisted")?.count || 0;
        const hiredCount =
          applicationStats.find((stat) => stat._id === "hired")?.count || 0;

        // Return the job data along with application stats
        return {
          ...job.toObject(), // Convert Mongoose document to plain object
          applications: {
            totalApplications,
            shortlistedCount,
            hiredCount,
          },
        };
      })
    );
     
    // Return the enhanced job data in the response
    return NextResponse.json(enhancedJobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    // Return an error message if something goes wrong
    return NextResponse.json({ message: "Failed to fetch jobs." }, { status: 500 });
  }
}
