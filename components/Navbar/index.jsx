"use client"; // Ensure this runs on the client-side
import Link from 'next/link';
import axios from 'axios';
import { navLinks } from "@/lib/constants";
import { IoIosNotifications } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5"
import { FaRegUserCircle, FaRegHeart } from "react-icons/fa";
import { useState, useRef, useEffect, useContext } from "react";
import ContextMenu from "@/components/UI/Contextmenu"; // Import the ContextMenu component
import { useRouter, usePathname } from "next/navigation";
import { GlobalContext } from "@/context"; // Import the GlobalContext
import MessageContext from "@/components/communication/messageContext"
import PageLevelLoader from '@/components/Loader';
function Navbar() {
  const { user, setIsAuthUser, pageLevelLoader,  avatar,userType,setPageLevelLoader,isAuthUser , unseenMessages} = useContext(GlobalContext); // Use context to get user and auth status
  const iconRef = useRef(null);
  const [isMessageContextVisible, setIsMessageContextVisible] = useState(false);
  // Get the current pathname
  const pathname = usePathname();
  const router = useRouter();
 


  // State for context menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });


  const handleIconClick = (event) => {
    const iconHeight = 10;
    const iconx = 80; // Adjust this value based on your icon's height
    setMenuPosition({
      x: event.clientX - iconx, // Use clientX for left alignment
      y: event.clientY + iconHeight, // Fixed height below the icon
    });
    setMenuOpen((prev) => !prev); // Toggle the context menu
  };

  const handleEditProfile = () => {
    if (pathname === `/profile`) {
      return; // Do nothing if already on the profile page
    }
    setPageLevelLoader(true); // Set loader before navigation
    router.push(`/profile`); // Assuming user object has a username property
  };

  const handleSignOut = () => {
    setIsAuthUser(false)
    localStorage.removeItem("user")
    setMenuOpen(false);
    // Handle sign-out logic here (e.g., clearing user context, etc.)
  };

  const handleCreateProperty = () => {
    if (pathname === '/create') {
      return; // Do nothing if already on the create page
    }
    setPageLevelLoader(true); // Set loader before navigation
    router.push(`/create`);
  };

  const handleWatchProfile = () => {
    if (pathname === '/user') {
      return; // Do nothing if already on the create page
    }
    setPageLevelLoader(true); // Set loader before navigation
    router.push(`/user/${user?._id}`);
  };

  const handleClickOutside = (event) => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const handleUserIconClick = (event) => { // Add event parameter

    if (pathname === "/auth/login") {

      return; // Do nothing if already on the profile page
    }
    if (!isAuthUser) {
      // Navigate to the login page if not signed in
      setPageLevelLoader(true); // Set loader before navigation
      router.push('/auth/login');
    } else if (user && Object.keys(user).length > 0) { // Check if user is not an empty object
      handleIconClick(event); // Pass event to handleIconClick
    }
    // Optionally handle the case where the user is signed in but still not ready to open the context menu
  };

  const handleSavedJobsClick = () => {
    // Navigate to the saved jobs page
    router.push('/savedJobs');
  };

  return (
    <>
      {pageLevelLoader && (
        <div className="w-full min-h-screen fixed top-0 left-0 flex justify-center items-center bg-white z-50">
          <PageLevelLoader />
        </div>
      )}
      <nav className="border-b-4 border-b-dashed border-b-custom-mint-green py-1 my-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Map through navLinks to generate each Link */}
            {navLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className={`ml-9 ${pathname === link.url
                  ? "text-lg font-bold" // Active link styles
                  : "text-sm font-medium"
                  }`}
                onClick={() => {
                  // Only set loader if the link is not the current page
                  if (pathname !== link.url && pathname !== '/unauthorized-page') {
                    setPageLevelLoader(true); // Set loader before navigation
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right-Side Icons */}
          <ul
            className="flex items-center space-x-6"
            onClick={handleClickOutside}
          >
            {/* Messages Icon */}
            {isAuthUser && user && (
              <li className="relative cursor-pointer" title="Messages" onClick={(e) => {
                e.stopPropagation();
                setIsMessageContextVisible(!isMessageContextVisible);
              }}>
                <IoMailOutline
                  className="text-3xl text-custom-dark-mint-green  hover:text-green-700 transition"
                />
                {unseenMessages > 0 &&(
                  <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                    {unseenMessages}
                  </span>

                )}

                {isMessageContextVisible && (
                  <MessageContext
                    onClose={() => setIsMessageContextVisible(false)}
                  />
                )}
              </li>
            )}
            {/* Saved Jobs */}
            {isAuthUser && user && (
              <li title="Saved Jobs">
                <FaRegHeart
                  onClick={handleSavedJobsClick}
                  className="text-3xl text-custom-dark-mint-green cursor-pointer hover:text-green-700 transition"
                />
              </li>
            )}

            {/* User Icon */}
            <li onClick={handleUserIconClick} title="User Profile">
              {isAuthUser && avatar ? (
                <img
                  src={avatar}
                  alt="User Profile"
                  className="rounded-full w-10 h-10 object-cover cursor-pointer"
                />
              ) : (
                <FaRegUserCircle className="text-3xl text-custom-dark-mint-green cursor-pointer" />
              )}
            </li>

            {/* Notifications */}
            <li title="Notifications">
              <Link href="#">
                <IoIosNotifications className="text-3xl text-custom-dark-mint-green hover:text-green-700 transition" />
              </Link>
            </li>

            {/* Context Menu */}
            <li>
              <ContextMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                onEditProfile={handleEditProfile}
                onSeeProfile={handleWatchProfile}
                onSignOut={handleSignOut}
                onCreateProperty={handleCreateProperty}
                position={menuPosition}
                userType={userType}
              />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
