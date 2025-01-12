

"use client";
import { FaCalendarAlt, FaUser, FaEnvelope, FaCircle, FaLink, FaBriefcase } from "react-icons/fa"; // Added FaLink and FaBriefcase
import Image from "next/image";
import { useContext } from "react"; // Assuming you have user context
import { GlobalContext } from "@/context";
import { useRouter } from "next/navigation";

const SideProfile = ({ participants, groupName, groupPic, groupAdmin }) => {
  const { user ,setPageLevelLoader } = useContext(GlobalContext);
  const router = useRouter();
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Filter participants to exclude the current user
  const otherParticipants = participants.filter(
    (participant) => participant._id !== user?._id
  );
  const participant = otherParticipants[0]; // Assuming there's only one other participant

  const handleClick = (participantId)=>{
      
    setPageLevelLoader(true);
     
    router.push(`/user/${participantId}`)
    
  }

  return (
    <aside className={`flex flex-col items-center p-6 space-y-6 bg-white rounded-lg shadow-lg w-full h-full overflow-hidden ${groupName ? "space-y-4" : ""}`}>
      {/* Display Group Info only if groupName is present */}
      {groupName && (
        <>
          {/* Group Picture */}
          {groupPic && (
            <div className="relative mb-4">
              <Image
                src={groupPic}
                alt="Group Picture"
                className="rounded-lg shadow-md"
                width={200} // Increase size for group picture
                height={200}
              />
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-800 text-center">{groupName}</h2>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-gray-600">Participants: {participants.length}</span>

            {/* Avatar with status */}
            <div className="relative flex flex-col items-center mb-4">
              {groupAdmin?.avatar ? (
                <Image
                  src={groupAdmin.avatar}
                  alt="Profile"
                  className="rounded-full shadow-md"
                  width={120}
                  height={120}
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-500 rounded-full shadow-md w-12 h-12 text-white font-semibold">
                  {groupAdmin?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-center text-gray-800 font-semibold mt-2">
                Admin: {groupAdmin?.fullName || "Unknown"}
              </span>
              <span
                className={`absolute top-0 right-0 rounded-full w-3 h-3 ${groupAdmin?.online ? "bg-green-600" : "bg-gray-400"}`}
              ></span>
              <span className="text-sm text-gray-500 mt-1">
                {groupAdmin?.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Profile Information (Only Participant Info if no groupName) */}
      {!groupName && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 text-center cursor-pointer" onClick={()=>{handleClick(participant._id)}}>{participant?.fullName}</h3>
          {/* Online Status */}
          <p
            className={`text-sm ${participant?.online ? "text-green-600" : "text-gray-500"} flex items-center justify-center`}
          >
            <FaCircle className="mr-2" />
            {participant?.online ? "Online" : "Offline"}
          </p>

          {/* Profile Picture */}
          <div className="relative mb-4">
            {participant?.avatar ? (
              <Image
                src={participant?.avatar || "/default-avatar.png"}
                alt="Profile"
                className="rounded-full shadow-md"
                width={120}
                height={120}
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-500 rounded-full shadow-md w-12 h-12 text-white font-semibold">
                {participant?.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className={`absolute top-0 right-0 rounded-full w-3 h-3 ${participant?.online ? "bg-green-600" : "bg-gray-400"}`}
            ></span>
          </div>
          {/* Profile Details */}
          <div className="w-full space-y-4 text-sm text-gray-600">
            {/* Email */}
            <div className="flex items-center justify-between">
              <FaEnvelope className="text-blue-500 w-5 h-5 mr-2" />
              <span>{participant?.email}</span>
            </div>

            {/* Member Since */}
            <div className="flex items-center justify-between">
              <FaCalendarAlt className="text-green-600 w-5 h-5 mr-2" />
              <span>Joined: {formatDate(participant?.createdAt)}</span>
            </div>

            {/* User Type Specific Info */}
            {participant?.usertype === "recruiter" ? (
              <>
                <div className="flex items-center justify-between">
                  <FaBriefcase className="text-gray-700 w-5 h-5 mr-2" />
                  <span>{participant?.companyName || "Company Name"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">About Company</span>
                  <span>{participant?.aboutCompany || "No information available."}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <FaUser className="text-purple-500 w-5 h-5 mr-2" />
                  <span>{participant?.aboutMe || "No information available."}</span>
                </div>
                <div className="flex items-center justify-between">
                  <FaLink className="text-teal-500 w-5 h-5 mr-2" />
                  <a
                    href={participant?.portfolioUrl || "#"}
                    className="text-teal-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {participant?.portfolioUrl ? "View Portfolio" : "No Portfolio"}
                  </a>
                </div>
              </>
            )}

            {/* Additional Info */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Credits</span>
              <span>{participant?.credits || "0"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Applied Jobs</span>
              <span>{participant?.appliedJobs?.length || "0"}</span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default SideProfile;