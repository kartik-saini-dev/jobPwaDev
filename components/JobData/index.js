"use client";
import { FaEye, FaUserAlt, FaClipboardCheck, FaClipboardList, FaBriefcase, FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa'; 
import { useRouter } from 'next/navigation';
import { useState, useEffect,useContext } from "react";
import axios from "axios";
import Pagination from "@/components/Home/Pagination";
import { GlobalContext } from '@/context';

// Sample job data for demonstration
const jobPosts = [
  {
    title: "Production Technician - Gas Mixing",
    createdAt: "18 August 2024",
    experience: "0-1 years",
    payRange: "$45.00 - $50.00 / hr",
    location: "Bengaluru, Karnataka",
    totalViews: 1000,
    applications: [100,12,12],
    totalShortlists: 50,
    totalHirings: 0,
    daysForDeactivation: 24,
  },
  {
    title: "Mechanical Engineer",
    createdAt: "20 August 2024",
    experience: "1-3 years",
    payRange: "$60.00 - $70.00 / hr",
    location: "Bengaluru, Karnataka",
    totalViews: 800,
    applications:[90,12,12],
    totalShortlists: 40,
    totalHirings: 1,
    daysForDeactivation: 15,
  },
  {
    title: "Quality Control Specialist",
    createdAt: "25 August 2024",
    experience: "0-1 years",
    payRange: "$50.00 - $55.00 / hr",
    location: "Bengaluru, Karnataka",
    totalViews: 1200,
    applications: [150,12,12],
    totalShortlists: 60,
    totalHirings: 2,
    daysForDeactivation: 30,
  },
];

export default function JobData() {
  const [fetchedJobs, setFetchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const {setPageLevelLoader} = useContext(GlobalContext)
  const [page, setPage] = useState(1); // Current page
  const itemsPerPage = 3; // Number of items per page
  const totalPages = Math.ceil(fetchedJobs.length / itemsPerPage); // Calculate total pages
  const router = useRouter();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs/getJobs/applications"); // Replace with your actual backend endpoint
              
   
        setFetchedJobs([...response.data, ...jobPosts]); 
     
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can customize this loading state
  }

  if (fetchedJobs.length === 0) {
    return <div>No job postings available.</div>; // Handle the case with no jobs
  }

  // Calculate the jobs to display on the current page
  const displayedJobs = fetchedJobs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleClick = (jobId)=>{
      
    setPageLevelLoader(true);

    router.push(`/application/${jobId}`);

  }
  return (
    <div className="w-full md:w-4/5 my-5 ml-2 md:ml-10">
      {displayedJobs.map((job, index) => (
        <div
          key={index}
          className={`border-2 border-custom-mint-green rounded-xl mb-5 ${index === 0 ? 'mt-0' : 'mt-4'}`}
        >
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-2 rounded-2xl bg-custom-mint-green`}>
            <h3 className="text-lg md:text-xl font-bold">{job.title}</h3>
            <p className="text-sm md:text-lg font-semibold text-gray-600 mt-1 md:mt-0">
              Posted on: {new Date(job.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                  year: "numeric",
                })}
            </p>
          </div>
          <div className="p-4">
            <div className="flex flex-col md:flex-row justify-start items-start md:items-center mb-4 text-gray-500">
              <div className="flex items-center mb-2 md:mb-0 mr-4">
                <FaBriefcase className="mr-2 text-custom-dark-mint-green font-bold" />
                <p className="text-md">{job.experience}</p>
              </div>
              <div className="flex items-center mb-2 md:mb-0 mr-4">
                <FaDollarSign className="mr-2 text-custom-dark-mint-green font-bold" />
                <p className="text-md">{job.salary}</p>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-custom-dark-mint-green font-bold" />
                <p className="text-md">{job.jobType}</p>
              </div>
            </div>
  
            {/* Job stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <div className="text-center">
                <p className="text-sm">Total Views</p>
                <div className="flex justify-center items-center mt-2">
                  <FaEye className="text-custom-dark-mint-green font-bold" />
                  <p className="ml-1">{job.viewCount}</p>
                </div>
              </div>
  
              <div className="text-center">
                <p className="text-sm">Total Applicants</p>
                <div className="flex justify-center items-center mt-2">
                  <FaUserAlt className="text-custom-dark-mint-green font-bold" />
                  <p onClick={() => handleClick(job._id)} className="cursor-pointer">
                    <span className="ml-1 text-blue-600 hover:underline">{job.applications.totalApplications}</span>
                  </p>
                </div>
              </div>
  
              <div className="text-center">
                <p className="text-sm">Total Shortlists</p>
                <div className="flex justify-center items-center mt-2">
                  <FaClipboardCheck className="text-custom-dark-mint-green font-bold" />
                  <p className="ml-1">{job.applications.shortlistedCount}</p>
                </div>
              </div>
  
              <div className="text-center">
                <p className="text-sm">Total Hires</p>
                <div className="flex justify-center items-center mt-2">
                  <FaClipboardList className="text-custom-dark-mint-green font-bold" />
                  <p className="ml-1">{job.applications.hiredCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
  
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}