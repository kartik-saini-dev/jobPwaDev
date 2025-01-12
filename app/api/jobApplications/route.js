

import connectToDB from "@/database"; // DB connection
import Application from "@/models/application"; // Application model
import { NextResponse } from "next/server"; // Next.js response

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await connectToDB();
     

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");

        if (!jobId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Job ID is required.",
                },
                { status: 400 }
            );
        }

        // Query applications with the provided jobId
        const applications = await Application.find({ job: jobId })
            .populate({
                path: "user",
                select: "fullName", // Populate `user` with `fullName`
            })
            .populate({
                path: "recruiter",
                select: "fullName", // Populate `recruiter` with `fullName`
            })
            .populate({
                path: "job",
                select: "category title companyName", // Populate `job` with specific fields
            });

        if (!applications || applications.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No applications found for this job.",
            });
        }

        return NextResponse.json({
            success: true,
            data: applications,
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while retrieving applications. Please try again.",
        });
    }
}
