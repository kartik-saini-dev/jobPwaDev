"use client";
import React from "react";

const ContextMenu = ({ isOpen, onClose, onEditProfile, onSeeProfile, onSignOut, onCreateProperty, position ,userType}) => {
  if (!isOpen) return null; // Return null if the menu is not open
 
  
  return (
    <div
      onMouseLeave={onClose}
      style={{ top: position.y, left: position.x }} // Use the passed position
      className="absolute bg-white shadow-lg rounded-lg z-50 border border-gray-200"
    >
      <ul className="flex flex-col p-2 min-w-[150px] max-w-[200px] space-y-2">
     
        <li
          onClick={onEditProfile}
          className="cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200 rounded-md px-4 py-2 text-gray-700 text-center"
        >
          Edit Profile
        </li>
      
        <li
          onClick={onSeeProfile}
          className="cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200 rounded-md px-4 py-2 text-gray-700 text-center"
        >
           See Profile
        </li>
        {userType === "recruiter" && (
        <li
          onClick={onCreateProperty}
          className="cursor-pointer hover:bg-green-500 hover:text-white transition-all duration-200 rounded-md px-4 py-2 text-gray-700 text-center whitespace-nowrap"
        >
          Create Job
        </li>
          )}
        <li
          onClick={onSignOut}
          className="cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-200 rounded-md px-4 py-2 text-gray-700 text-center"
        >
          Sign Out
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
