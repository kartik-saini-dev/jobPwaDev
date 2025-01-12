


"use client";
import JobData from '@/components/JobData';
import { FaPenToSquare } from "react-icons/fa6";
import { IoSettingsOutline, IoSearch, IoOptionsOutline } from "react-icons/io5";
import ChartFive from '@/components/ChartFive';
import { FaEye, FaUserAlt, FaClipboardCheck, FaClipboardList, FaSuitcase, FaEllipsisH } from 'react-icons/fa'; 
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '@/context'; // Import your context
import axios from 'axios';


export default function Manage() {
  const { setPageLevelLoader } = useContext(GlobalContext); // Access context
  const [loading, setLoading] = useState(true); // Loading state

  const [data, setData] = useState({
    totalJobPosts: 0,
    totalViews: 0,
    totalApplicants: 0,
    totalShortlists: 0,
    totalHirings: 0,
  });

  

  useEffect(() => {

    
    // Set the loader to false when this component mounts
    setPageLevelLoader(false);

    // Fetch data from the backend
    axios.get('/api/dashboard-stats')  // Replace with your API endpoint
      .then(response => {
        const {data:fetchedData} = response.data;
        
        setData({
          totalJobPosts: fetchedData.totalJobPosts || 50,  // Default value 50 if backend returns 0
          totalViews: fetchedData.totalViews || 1000,      // Default value 1000 if backend returns 0
          totalApplicants: fetchedData.totalApplicants || 500,  // Default value 500 if backend returns 0
          totalShortlists: fetchedData.totalShortlists || 50,   // Default value 50 if backend returns 0
          totalHirings: fetchedData.totalHirings || 10,     // Default value 10 if backend returns 0
        });
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });    

    // Set loading to false after verification
    setLoading(false);

    return () => {
      // Cleanup logic (if necessary)
    };
  }, [setPageLevelLoader]);

  if (loading) {
    // You can show a loader or placeholder while data is being fetched
    return <div>Loading...</div>;
  }


  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="border-b-4  border-custom-mint-green py-1 my-5">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-md playfair_display font-bold ml-2">Manage Jobs</p>
          <div className="flex items-center mt-2 md:mt-0">
            <FaPenToSquare className="text-3xl text-custom-dark-mint-green mr-4" />
            <IoSettingsOutline className="text-3xl text-custom-dark-mint-green mr-4" />
          </div>
        </div>
      </header>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Section */}
        <div className="w-full md:w-1/4 p-4 space-y-6">
          {/* Info Cards */}
          {[{ icon: FaSuitcase, title: "Total Job Posts", count: data.totalJobPosts, growth: "↑ 2%", period: "This month" },
             { icon: FaEye, title: "Total Views", count: data.totalViews, growth: "↑ 4%", period: "This week" },
             { icon: FaUserAlt, title: "Total Applicants", count: data.totalApplicants, growth: "↑ 2%", period: "From 6 months" },
             { icon: FaClipboardCheck, title: "Total Shortlists", count: data.totalShortlists, growth: "↑ 1%", period: "So far" },
             { icon: FaClipboardList, title: "Total Hirings", count: data.totalHirings, growth: "↑ 1%", period: "So far" },
          ].map(({ icon: Icon, title, count, growth, period }, index) => (
            <div key={index} className="bg-custom-mint-green p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <Icon className="text-gray-600 text-2xl" />
                <h3 className="text-lg font-bold">{title}</h3>
                <FaEllipsisH className="text-gray-400 text-xl" />
              </div>
              <p className="text-4xl font-semibold my-2">{count}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span className="text-green-500">{growth}</span>
                <span>{period}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full md:w-3/4 p-4">
          {/* Search Section */}
          <div className="flex items-center justify-between mb-10">
            {/* Search Input */}
            <div className="relative flex-grow mr-3">
              <IoSearch className="absolute left-0 top-2 ml-3 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search job post"
                className="w-full pl-10 pr-14 py-2 rounded-full border border-custom-dark-mint-green text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:w-3/4 md:w-2/3 lg:w-3/4"
              />
            </div>

            {/* Filter Icon */}
            <IoOptionsOutline className="text-custom-dark-mint-green" size={24} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Responsive ChartFive */}
            <ChartFive />
            <ChartFive />
          </div>

          {/* Job Data Section */}
          <JobData />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-center mt-12">
        <p className="text-gray-600">&copy; 2024 Job Management Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}
