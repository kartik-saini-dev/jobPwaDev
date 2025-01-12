"use client"; 
import { usePageState } from "@/lib/hooks/customhooks";
import Pagination from "@/components/Home/Pagination";
import { useRouter } from 'next/navigation';
import { useContext } from "react";
import { GlobalContext } from "@/context";
import { toast,Toaster } from "sonner";
const Feed = () => {
  const [page, handlePageChange] = usePageState("jobPage");
  const router = useRouter();
  const itemsPerPage = 6;
  
  const { filterData, setPageLevelLoader } = useContext(GlobalContext) || {}; // Graceful fallback if context is null
  
  // Safeguard against null/undefined filterData
  const safeFilterData = Array.isArray(filterData) ? filterData : [];
  
  const totalPages = Math.ceil(safeFilterData.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = safeFilterData.slice(startIndex, endIndex);

  const handleClick = (recruiterId,deadline) => {
    const deadlineDate = new Date(deadline);
    if ( !recruiterId || deadlineDate < new Date()) {
      toast.warning(
        "This position is currently unavailable."
      );
      return; // Prevent navigation on unavailability
    }

    setPageLevelLoader(true);
    router.push(`/job/${recruiterId}`);
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      <Toaster />
      <h2 className="text-2xl playfair_display font-bold mb-4 text-center sm:text-left">Available Jobs</h2>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <div
              key={job._id || job.id} // Use either _id from MongoDB or id from dummy data
              className="border rounded-md overflow-hidden shadow-md transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleClick(job.recruiterId?._id, job.deadline)} // Navigate using recruiterId if available
            >
              <img
                src={job.images?.[0] || job.image || "/fallback-image.jpg"} // Fallback image if none provided
                alt={job.title || "Job Image"}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold playfair_display text-lg mb-2 truncate">{job.title || "Untitled Job"}</h3>
                <p className="text-gray-500 text-sm mb-1">
                  {job.salary ? `$${job.salary.toLocaleString()} per year` : "Salary not specified"}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {job.recruiterId?.fullName || "Unknown Recruiter"} {/* Graceful fallback for missing recruiter */}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No jobs found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="w-full flex items-center justify-center mt-4">
        <Pagination
          totalPages={totalPages}
          onPageChange={handlePageChange}
          currentPage={page}
        />
      </div>
    </div>
  );
};

export default Feed;
