// app/jobs/[id]/page.js (or appropriate location based on your routing)

import Sidebar from "@/components/Home/Sidebar";
import RightSidebar from "@/components/User/RightSidebar";
import JobList from "@/components/Jobs/JobList";
import { fetchJobsList } from '@/services/fetchJob';

const JobsListPage = async ({ params: { id: userId } }) => {
  try {
    // Fetch dynamic jobs from API on the server side
    const userJobsList = await fetchJobsList(userId);

    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
        {/* Left Sidebar */}
        <div className="flex md:col-span-12 lg:col-span-2 bg-white shadow-md p-4">
          <div className="w-full bg-white p-4 shadow-md flex flex-col md:flex-row md:gap-4 lg:flex-col">
            <Sidebar Jobs={userJobsList.data} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
            Jobs by Recruiter
          </h2>
          <JobList userJobs={userJobsList.data} />
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          recruiter={userJobsList.data[0]?.recruiterId}
          className="w-full sm:w-1/2 lg:w-1/4 bg-white hidden lg:block shadow-md lg:shadow-none"
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Error loading jobs. Please try again later.</p>
      </div>
    );
  }
};

export default JobsListPage;
