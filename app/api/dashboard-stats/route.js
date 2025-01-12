import connectToDB from "@/database";
import Job from "@/models/job";
import Application from "@/models/application";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Force dynamic rendering for the API new request everytime no cache

export async function GET(req) { 
    try {
        await connectToDB(); // Connect to the database

        // Perform an aggregation pipeline to compute statistics related to jobs and applications
        const stats = await Job.aggregate([ // Use the Job model to aggregate data
            {
                $lookup: { // Lookup to join data from the "applications" collection
                    from: "applications", // The collection we want to join with (applications)
                    localField: "_id", // The field in the "jobs" collection to join (job ID)
                    foreignField: "job", // The field in the "applications" collection that references the job ID
                    as: "applications" // Create a new field "applications" to store the matched data
                }
            },
            {
                $group: { // Group the data and calculate various statistics
                    _id: null, // Grouping by null to return a single document with the stats
                    totalJobPosts: { $sum: 1 }, // Count the total number of job posts
                    totalViews: { 
                        $sum: { 
                            $size: { $ifNull: ["$views", []] } // Count the number of views for each job (if views exist)
                        }
                    },
                    totalApplicants: { $sum: { $size: "$applications" } }, // Count the total number of applicants for all jobs
                    totalShortlists: { 
                        $sum: {
                            $size: {
                                $filter: { // Filter to count only "shortlisted" applications
                                    input: "$applications", // The list of applications for the job
                                    as: "application", // Alias for each application in the list
                                    cond: { $eq: ["$$application.status", "shortlisted"] } // Condition to check if the application is shortlisted
                                }
                            }
                        }
                    },
                    totalHirings: { 
                        $sum: {
                            $size: {
                                $filter: { // Filter to count only "hired" applications
                                    input: "$applications", // The list of applications for the job
                                    as: "application", // Alias for each application in the list
                                    cond: { $eq: ["$$application.status", "hired"] } // Condition to check if the application is hired
                                }
                            }
                        }
                    }
                }
            }
        ]);
            
        // Check if no data was found (empty stats array)
        if (stats.length === 0) {
            return NextResponse.json({
                success: true, // Return a successful response
                data: { // Provide default statistics if no data is found
                    totalJobPosts: 0,
                    totalViews: 0,
                    totalApplicants: 0,
                    totalShortlists: 0,
                    totalHirings: 0,
                },
            });
        }

        // Return the aggregated statistics from the first document
        return NextResponse.json({
            success: true, // Return a successful response
            data: stats[0], // Return the first document which contains the aggregated stats
        });

    } catch (error) {
     
        return NextResponse.json({
            success: false, 
            message: "An error occurred while retrieving job statistics. Please try again.", 
        });
    }
}
