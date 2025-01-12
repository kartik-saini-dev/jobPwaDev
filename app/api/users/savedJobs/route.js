import connectToDB from "@/database"; // DB connection
import Application from "@/models/application"; // Application model
import { NextResponse } from "next/server"; // Next.js response

// Enable dynamic fetching
export const dynamic = "force-dynamic";

// API handler for GET requests
export async function GET(req) {
  try {
    await connectToDB();

    // Extract userId from query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    // Fetch applications for the user with only job details
    const applications = await Application.find({ user: userId })
      .populate({
        path: "job", // Populate job details
        select: "title description images companyName", // Select relevant job fields
      });

    if (!applications || applications.length === 0) {
      return NextResponse.json({ error: "No applications found for this user." }, { status: 404 });
    }

    // Format the response data
    const appliedJobs = applications.map((application) => ({
      job: application.job,
      appliedAt: application.appliedAt,
      status: application.status,
    }));

    return NextResponse.json({ data: appliedJobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching applied jobs." },
      { status: 500 }
    );
  }
}
