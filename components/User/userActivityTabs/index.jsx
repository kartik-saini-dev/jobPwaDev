"use client";

import React, { useState, useEffect, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import {  MdEmail, MdBusiness, MdCreditScore } from "react-icons/md";
import { BsGlobe2 } from "react-icons/bs";
import { AiOutlineUser,AiOutlineInfoCircle,AiOutlineFile } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../../context";

const UserActivityTabs = ({ userInfo }) => {
  

  const [activeTab, setActiveTab] = useState("Followers");
  const router = useRouter();
  const { setPageLevelLoader } = useContext(GlobalContext);

  useEffect(() => {

    setPageLevelLoader(false);

  }, []);
    
  const handleClick = (recruiterId)=>{
    setPageLevelLoader(true);
    router.push(`/job/${recruiterId}`)
  }

  if (!userInfo) {
    return <p className="text-center text-gray-600">Loading user data...</p>;
  }
  return (
    <div className="w-full bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-purple-500 to-teal-400 h-44">
        {/* User Image */}
        <div className="absolute inset-x-0 -bottom-14 flex justify-center">
          {userInfo?.avatar ? (
            <img
              src={userInfo?.avatar}
              alt={userInfo.fullName}
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
          ) : (
            <FaUserCircle className="w-28 h-28 text-white bg-gray-300 rounded-full border-4 border-white" />
          )}
        </div>
      </div>

      {/* User Details */}
      <div className="mt-20 mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            {/* User Info Section */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{userInfo.fullName}</h1>
              <p className="text-gray-600 text-lg mt-2 flex items-center justify-center md:justify-start">
                <MdEmail className="inline-block text-teal-500 mr-2" />
                {userInfo.email}
              </p>
              <p className="text-gray-600 cursor-pointer text-lg mt-2 flex items-center justify-center md:justify-start" onClick={()=>{handleClick(userInfo.recruiterId)}}>
               JobsPosted: {userInfo.postedJobsCount}
              </p>
            </div>

            {/* Recruiter or General User Info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4">
              {/* Left Section */}
              <div className="flex-1">
                {userInfo.userType === "recruiter" ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MdBusiness className="text-teal-500" />
                      <p className="text-gray-600">{userInfo.companyName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BsGlobe2 className="text-teal-500" />
                      <a
                        href={userInfo.companyWebsite.startsWith("http") ? userInfo.companyWebsite : `https://${userInfo.companyWebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {userInfo.companyWebsite}
                      </a>
                    </div>
                    {userInfo.aboutCompany && (
                      <p className="text-gray-600 italic">{userInfo.aboutCompany}</p>
                    )}
                  </div>
                ) : userInfo.userType === "employee" ? (
                  <div className="space-y-4">
                    {userInfo.aboutMe && (
                      <div>
                        <p className="text-gray-600 font-medium">About Me:</p>
                        <p className="text-gray-600">{userInfo.aboutMe}</p>
                      </div>
                    )}
                    {userInfo.portfolioUrl && (
                      <div className="flex items-center space-x-2">
                        <BsGlobe2 className="text-teal-500" />
                        <a
                          href={userInfo.portfolioUrl.startsWith("http") ? userInfo.portfolioUrl : `https://${userInfo.portfolioUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Portfolio
                        </a>
                      </div>
                    )}
                    {userInfo.resume && (
                      <div className="flex items-center space-x-2">
                        <AiOutlineFile className="text-teal-500" />
                        <a
                          href={userInfo.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mt-2">
                    <AiOutlineUser className="text-teal-500" />
                    <p className="text-gray-600">General User</p>
                  </div>
                )}
              </div>

              {/* Right Section (Description) */}
              {userInfo.description && (
                <div className="md:ml-8 mt-4 md:mt-0 flex items-start space-x-2 bg-gray-50 p-4 rounded-lg shadow-md">
                  <AiOutlineInfoCircle className="text-teal-500 mt-1" />
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Description: </span>
                    {userInfo.description}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-6 mx-auto px-4 max-w-4xl">
        <div className="flex justify-around bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">{userInfo.followers.length}</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">{userInfo.following.length}</p>
            <p className="text-gray-600">Following</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">{userInfo.credits}</p>
            <p className="text-gray-600">
              <MdCreditScore className="inline-block text-teal-500 mr-1" />
              Credits
            </p>
          </div>
        </div>
      </div>


      {/* Tabs Section */}
      <div className="bg-white mt-6 shadow-md rounded-lg">
        <div className="flex justify-center p-4">
          {["Followers", "Following"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-medium px-4 ${activeTab === tab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-600"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "Followers" && (
          <div>
            {userInfo.followers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto px-4 max-w-5xl">
                {userInfo.followers.map((follower, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(`/user/${follower.userId._id}`)}
                    className="flex flex-col items-center bg-white border rounded-lg shadow-md p-4 hover:shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  >
                    {follower.userId?.avatar ? (
                      <img
                        src={follower.userId?.avatar}
                        alt={follower.userId.fullName}
                        className="w-16 h-16 rounded-full object-cover mb-3"
                      />
                    ) : (
                      <FaUserCircle className="w-16 h-16 text-gray-500 mb-3" />
                    )}
                    <p className="text-lg text-gray-800 font-medium text-center">
                      {follower.userId.fullName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">No followers to display.</p>
            )}
          </div>
        )}

        {activeTab === "Following" && (
          <div>
            {userInfo.following.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto px-4 max-w-5xl">
                {userInfo.following.map((followed, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(`/user/${followed.userId._id}`)}
                    className="flex flex-col items-center bg-white border rounded-lg shadow-md p-4 hover:shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  >
                    {followed.userId?.avatar ? (
                      <img
                        src={followed.userId?.avatar}
                        alt={followed.userId.fullName}
                        className="w-16 h-16 rounded-full object-cover mb-3"
                      />
                    ) : (
                      <FaUserCircle className="w-16 h-16 text-gray-500 mb-3" />
                    )}
                    <p className="text-lg text-gray-800 font-medium text-center">
                      {followed.userId.fullName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">No following to display.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityTabs;
