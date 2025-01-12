"use client";
import { FaFacebook, FaTwitter, FaInstagram, FaRegUserCircle } from "react-icons/fa";
import { useContext ,useEffect} from "react";
import { GlobalContext } from "@/context";
import { useRouter } from "next/navigation";
import {toast,Toaster} from "sonner";
const RightSidebar = ({ recruiter }) => {
  const router = useRouter();
  const { user, isFollowing , setIsFollowing, setPageLevelLoader } = useContext(GlobalContext);
  const loggedInUserId = user?._id;

  
  useEffect(() => {
    // Check if the logged-in user is following the recruiter
    if (loggedInUserId && recruiter?.followers?.some(follower => follower.userId === loggedInUserId)) {
      setIsFollowing(true); // Set follow status based on the recruiter data
    } else if(isFollowing){
      setIsFollowing(true); 
     } else {
      setIsFollowing(false); // Reset if not following
    }
  }, [loggedInUserId, recruiter?.followers]);

  const handleFollow = async () => {
    if (!loggedInUserId) {
      toast.error("Login required");
      return;
    }

    try {
      const response = await fetch("/api/users/toggleFollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId, followerId: recruiter?._id }),
      });

      const result = await response.json();
           console.log(result,"this is resutl")
      if (response.ok) {
        // Update global state dynamically
        setIsFollowing(result.isFollowing);
      } else {
        console.error(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleClick = (recruiterId) => {
    setPageLevelLoader(true);
    router.push(`/user/${recruiterId}`);
  };

  if (!recruiter) {
    return <p className="text-gray-600">Recruiter information is not available.</p>;
  }

  return (
    <div className="w-full lg:w-1/4 sm:w-2/3 p-4 sm:p-6 bg-gray-100 rounded-md shadow-md h-fit mx-auto lg:mx-0">
      <h2 className="text-xl font-bold mb-4 text-center sm:text-left">User Information</h2>

      <div className="flex flex-col sm:flex-row items-center mb-4">
        {recruiter?.avatar ? (
          <img
            src={recruiter.avatar}
            alt={recruiter.fullName}
            className="w-16 h-16 rounded-full mb-4 sm:mb-0 sm:mr-4 shadow-md"
          />
        ) : (
          <FaRegUserCircle className="w-16 h-16 text-gray-400 mb-4 sm:mb-0 sm:mr-4" />
        )}
        <div className="text-center sm:text-left">
          <h3
            className="text-lg cursor-pointer font-semibold"
            onClick={() => handleClick(recruiter._id)}
          >
            {recruiter.fullName}
          </h3>
          <p className="text-gray-600">{recruiter.email}</p>
        </div>
      </div>

      <h3 className="text-md font-semibold mb-2">About Company:</h3>
      <p className="text-gray-700 mb-4">
        {recruiter.aboutCompany || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
      </p>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Additional Info:</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>Company Name: {recruiter.companyName || "Not specified"}</li>
          <li>
            Joined:{" "}
            {recruiter.createdAt
              ? new Date(recruiter.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown"}
          </li>
          <li>Followers: {recruiter.followers?.length || 0}</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Connect:</h3>
        <div className="flex justify-center sm:justify-start space-x-3">
          
            <a href={recruiter.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebook className="w-6 h-6 text-blue-600 hover:text-blue-800" />
            </a>
  
        
            <a href={recruiter.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter className="w-6 h-6 text-blue-400 hover:text-blue-600" />
            </a>
    
            <a href={recruiter.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-6 h-6 text-pink-600 hover:text-pink-800" />
            </a>

        </div>
      </div>

      {recruiter?._id !== loggedInUserId && (
        <div className="flex justify-center sm:justify-between mt-4">
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded-md ${
              isFollowing
                ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                : "bg-custom-dark-mint-green text-white hover:bg-blue-200"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      )}

      <div className="flex justify-center sm:justify-between mt-4">
        <button className="bg-custom-dark-mint-green text-white px-4 py-2 rounded-md hover:bg-blue-200">
          Message
        </button>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default RightSidebar;
