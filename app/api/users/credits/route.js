import connectToDB from "@/database"; // DB connection
import {User} from "@/models/user"; // User model (assuming you have a User model)
import { NextResponse } from "next/server"; // Next.js response

// Enable dynamic fetching
export const dynamic = "force-dynamic";

// API handler for GET requests
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // Get the userId from the request query

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    await connectToDB(); // Connect to DB

    // Fetch the user from the database by userId
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Return the user's credits
    return NextResponse.json({
      success: true,
      credits: user.credits, // Assuming `credits` is a field in your User model
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json({ success: false, message: "An error occurred while fetching credits" }, { status: 500 });
  }
}
