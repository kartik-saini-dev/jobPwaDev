
import RightSidebar from "@/components/User/RightSidebar";
import SingleJob from "@/components/Jobs/singleJob";
import { fetchJob } from '@/services/fetchJob';


const singleJobPage = async ({ params: { jobId } }) => {
  try {


    // Fetch dynamic jobs from API
    const singleUserJob = await fetchJob(jobId);

       return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl playfair_display font-bold mb-4">
            Job by Recruiter
          </h2>

          {/* List of Jobs with Pagination */}
          <SingleJob job={singleUserJob.data} />
        </div>

        {/* Right Sidebar for user information */}
      
          <RightSidebar recruiter={singleUserJob.data.recruiterId} />
      
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

export default singleJobPage;
