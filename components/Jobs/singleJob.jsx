"use client";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { GlobalContext } from "@/context";
import { format } from 'date-fns';
import { appliedJobsUser } from "@/services/application";
import ComponentLevelLoader from "../Loader/componentlevel";
import { FaMapMarkerAlt, FaDollarSign, FaBriefcase, FaCalendarAlt, FaRegClock } from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { toast, Toaster } from "sonner";
const SingleJob = ({ job }) => {
  const {
    user,
    componentLevelLoader,
    setComponentLevelLoader,
    setPageLevelLoader,
    isApplied,
    setIsApplied,
  } = useContext(GlobalContext);
  const jobId = job._id;
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [credits, setCredits] = useState(0);
  const hasViewed = useRef(false);

  const fetchUserCredits = async () => {
    if (!user) return; // Only fetch if user is logged in
    try {
      const response = await axios.get(`/api/users/credits/?userId=${user._id}`);
      if (response.data.success) {
        setCredits(response.data.credits); // Set credits state
      }
    } catch (error) {
      // console.error("Error fetching user credits:", error);

    }
  };

  useEffect(() => {
    fetchUserCredits(); // Fetch credits when the user data changes
  }, [user]);

  const fetchAppliedJobs = async (jobId) => {
    if (!user) return; // Only fetch if user is logged in
    try {
      const response = await appliedJobsUser({ userId: user._id, jobId });
      console.log(response, "this is response")
      if (response && response.success) {
        setAppliedJobs(response.data);
        console.log(response.data, "this is data")
        setIsApplied(response.data.some((appliedJob) => appliedJob.job === jobId));
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      toast.error("Failed to fetch applied jobs.");
    }
  };

  useEffect(() => {
    setPageLevelLoader(false);
    if (user && jobId) {
      fetchAppliedJobs(jobId); // Fetch for the job when user or jobId changes
    }
  }, [user, jobId]);

  const handleApply = async () => {
    if (credits <= 0) {
      toast.error("Insufficient credits.");
      return;
    } else if (!user) {
      toast.error("Login First");
      return;
    }

    if (user?._id === job.recruiterId._id) {
      toast.error("Cannot apply for your own job.");
      return;
    }

    setComponentLevelLoader({ loading: true, id: job._id });

    try {
      const action = isApplied ? "unapply" : "apply";
      const response = await fetch("/api/jobs/applyToggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          jobId: job._id,
          action,
          recruiterId: job.recruiterId._id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);

        await fetchUserCredits(); // Fetch updated credits after applying/unapplying
        setIsApplied(!isApplied); // Toggle application status globally

        if (action === "apply") {
          setAppliedJobs([...appliedJobs, { job: job._id }]);
        } else {
          setAppliedJobs(appliedJobs.filter((appliedJob) => appliedJob.job !== job._id));
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while processing your request.");
    } finally {
      setComponentLevelLoader({ loading: false, id: "" });
    }
  };

  useEffect(() => {
    if (credits) {
      toast.success(`Credits Remaining ${credits}`);
    }
  }, [credits]);

  useEffect(() => {
    if (user && jobId && !hasViewed.current) {
      const increaseViewCount = async () => {
        try {
          await axios.post("/api/jobs/view", { userId: user._id, jobId });
          hasViewed.current = true; // Mark as viewed
        } catch (error) {
          console.error("Error incrementing view count", error);
        }
      };

      increaseViewCount();
    }
  }, [jobId, user]);

  if (!job) {
    return <p>Loading job details...</p>;
  }
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-2xl">
      <Toaster richColors />

      {/* Job Title Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl playfair_display font-extrabold text-gray-800">{job.title}</h1>
      </div>

      {/* Image Section */}
      {job.images && job.images.length > 0 && (
        <div className="w-full mb-8">
          <div className={job.images.length > 1 ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : ""}>
            {job.images.map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-xl transform transition duration-300 hover:scale-105"
              >
                <img
                  src={image}
                  alt={`Job Image ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Description */}
      <div
        dangerouslySetInnerHTML={{ __html: job.description }}
        className="text-lg text-gray-700 mb-8"
      />

      {/* Job Details */}
      <div className="mb-8">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">Job Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-custom-dark-mint-green text-xl" />
            <span className="font-medium text-gray-600">{job.location || "Remote"}</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaDollarSign className="text-custom-dark-mint-green text-xl" />
            <span className="font-medium text-gray-600">${job.salary} per month</span>
          </div>
          <div className="flex items-center space-x-3">
            <MdBusiness className="text-custom-dark-mint-green text-xl" />
            <span className="font-medium text-gray-600">{job.companyName}</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaBriefcase className="text-custom-dark-mint-green text-xl" />
            <span className="font-medium text-gray-600">{job.experience} years</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-custom-dark-mint-green text-xl" />
            <span className="font-medium text-gray-600">
              Created At: {format(new Date(job.createdAt), 'dd/MM/yyyy')}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-custom-dark-mint-green text-xl" />
            <span className="font-medium text-gray-600">
              Deadline: {format(new Date(job.deadline), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
      </div>

      {/* Key Requirements */}
      <div className="mb-8">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">Key Requirements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {job.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-3">
              <AiOutlineCheckCircle className="text-custom-dark-mint-green text-xl" />
              <span className="font-medium text-gray-600">{requirement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-8">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {job.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <AiOutlineCheckCircle className="text-custom-dark-mint-green text-xl" />
              <span className="font-medium text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-center">
          <button
            onClick={handleApply}
            className={`py-3 px-10 rounded-full font-bold text-lg transition flex items-center justify-center ${componentLevelLoader.loading
                ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                : "bg-custom-dark-mint-green text-white hover:bg-green-600"
              }`}
            disabled={componentLevelLoader.loading || credits <= 0}
          >
            {componentLevelLoader.loading && componentLevelLoader.id === job._id ? (
              <div className="flex items-center gap-2">
                <ComponentLevelLoader
                  text={isApplied ? "Unapplying..." : "Applying..."}
                  color="#ffffff"
                  loading={componentLevelLoader.loading}
                />
              </div>
            ) : isApplied ? (
              "Applied"
            ) : credits > 0 ? (
              "Apply Now"
            ) : (
              "Insufficient Credits"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleJob;


//  There is no need for a component-level loader in this case because there is only one single task. When there are multiple products, only the loading indicator for the specific product with the matching ID should be displayed Here is to show exactly what to do.