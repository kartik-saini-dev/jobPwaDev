"use client";

import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle, FaClock, FaList } from "react-icons/fa"; // Icons for status


const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const { user } = useContext(GlobalContext);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const fetchUserAppliedJobs = async () => {
    try {
      const response = await fetch(`/api/users/savedJobs?userId=${user?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.data) {
        setAppliedJobs(data.data);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAppliedJobs();
    }
  }, [user]);

  const handlePreviousImage = (jobId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [jobId]: (prev[jobId] || 0) > 0 ? prev[jobId] - 1 : totalImages - 1,
    }));
  };

  const handleNextImage = (jobId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [jobId]: (prev[jobId] || 0) < totalImages - 1 ? prev[jobId] + 1 : 0,
    }));
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Applied Jobs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((application) => (
            <div
              key={application.job._id}
              className="bg-white border rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out"
            >
              {/* Job Title */}
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {application.job.title}
              </h3>

              {/* Job Images */}
              {application.job.images && application.job.images.length > 0 && (
                <div className="relative mb-6">
                  <img
                    src={application.job.images[currentImageIndex[application.job._id] || 0]}
                    alt={application.job.title}
                    className="w-full h-56 object-cover rounded-md shadow-lg mb-4 transition-transform duration-300 ease-in-out"
                  />
                  {application.job.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          handlePreviousImage(application.job._id, application.job.images.length)
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full shadow-lg"
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={() =>
                          handleNextImage(application.job._id, application.job.images.length)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full shadow-lg"
                      >
                        <FaArrowRight />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Job Description */}
              <div
                className="mt-2 text-gray-700 text-sm mb-4"
                dangerouslySetInnerHTML={{ __html: application.job.description }}
              ></div>

              {/* Company Name */}
              <div className="text-lg font-semibold text-gray-800 mb-4">
                Company: <span className="text-blue-600">{application.job.companyName}</span>
              </div>

              {/* Application Status */}
              <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                {application.status === "hired" && (
                  <span className="text-green-600 flex items-center">
                    <FaCheckCircle className="mr-1" /> Hired
                  </span>
                )}
                {application.status === "rejected" && (
                  <span className="text-red-600 flex items-center">
                    <FaTimesCircle className="mr-1" /> Rejected
                  </span>
                )}
                {application.status === "pending" && (
                  <span className="text-yellow-600 flex items-center">
                    <FaClock className="mr-1" /> Pending
                  </span>
                )}
                {application.status === "shortlisted" && (
                  <span className="text-blue-600 flex items-center">
                    <FaList className="mr-1" /> Shortlisted
                  </span>
                )}
              </div>


              {/* Applied Date */}
              <p className="mt-2 text-sm text-gray-500">
                <span className="font-semibold">Applied At:</span>{" "}
                {new Date(application.appliedAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">You have not applied for any jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
