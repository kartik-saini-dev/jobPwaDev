
// import connectToDB from "@/database"; // DB connection
// import Job from "@/models/job"; // Job model
// import { NextResponse } from "next/server"; // Next.js response

// // Enable dynamic fetching
// export const dynamic = "force-dynamic";

// // API handler for GET requests
// export async function GET(req) {
//   try {
//     // Connect to the database
//     await connectToDB();

//     // Extract query parameters
//     const { searchParams } = req.nextUrl;
//     const filters = {};
//     const sortOptions = {};

//     // Job Type Filter
//     if (searchParams.has('jobType')) {
//       filters.jobType = { $in: searchParams.get('jobType').split(',') };
//     }

//     // Salary Range Filter
//     if (searchParams.has('salaryRange')) {
//       const salaryRange = searchParams.get('salaryRange').split(',');
//       const salaryConditions = salaryRange.map(range => {
//         const [minSalary, maxSalary] = range.split('-').map(Number);
//         return { salary: { $gte: minSalary, $lte: maxSalary } };
//       });
//       filters.$or = salaryConditions;
//     }

//     // Location Filter
//     if (searchParams.has('location')) {
//       filters.location = { $in: searchParams.get('location').split(',') };
//     }

//     // Experience Level Filter
//     if (searchParams.has('experienceLevel')) {
//       filters.experienceLevel = { $in: searchParams.get('experienceLevel').split(',') };
//     }

//     // Sorting
//     const sortBy = searchParams.get('sortBy');
//     if (sortBy) {
//       if (sortBy === 'date') {
//         sortOptions.createdAt = -1; // Sort by date descending
//       } else if (sortBy === 'salary') {
//         sortOptions.salary = -1; // Sort by salary descending
//       } else if (sortBy === 'experience') {
//         sortOptions.experience = -1; // Sort by experience descending
//       }
//     }

//     // Fetch jobs from the database
//     const jobs = await Job.find(filters)
//       .populate({
//         path: "recruiterId",
//         select: "fullName",
//       })
//       .sort(sortOptions);

//     // Return the jobs in the response
//     return NextResponse.json(jobs, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching jobs:", error);

//     // Return an error message if something goes wrong
//     return NextResponse.json({ message: "Failed to fetch jobs." }, { status: 500 });
//   }
// }


// above if filter want to be from backend 


import connectToDB from "@/database"; // DB connection
import Job from "@/models/job"; // Job model
import { NextResponse } from "next/server"; // Next.js response

// Enable dynamic fetching
export const dynamic = "force-dynamic";

// API handler for GET requests
export async function GET(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch all jobs from the database without filters
    const jobs = await Job.find()
      .populate({
        path: "recruiterId",
        select: "fullName",
      })
      .sort({ createdAt: -1 }); // Default sorting by date descending

    // Return the jobs in the response
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    // Return an error message if something goes wrong
    return NextResponse.json({ message: "Failed to fetch jobs." }, { status: 500 });
  }
}
