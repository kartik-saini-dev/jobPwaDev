"use client";
import { useRouter } from "next/navigation";
import { toast,Toaster } from "sonner";
import { useContext } from "react";
import { GlobalContext } from "@/context";
const ApplicationsTable = ({
    displayedApplications,
    selectedApplications,
    setSelectedApplications,
    handleSelectApplication,
    handleJobStatusChange,
    handleIndividualMessage,
    handleAddUserToExistingConversation
}) => {
 const router = useRouter();
 const {setPageLevelLoader} = useContext(GlobalContext);
 const handleClick = (userId)=>{
       setPageLevelLoader(true);
     if(userId){
        router.push(`/user/${userId}`)
     }else{
        toast.warning("user does not exist");
     }
 }
 return (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-left text-xs sm:text-sm">
          <th className="p-2 sm:p-4">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedApplications(displayedApplications.map((app) => app._id));
                } else {
                  setSelectedApplications([]);
                }
              }}
              checked={selectedApplications.length === displayedApplications.length}
            />
          </th>
          <th className="p-2 sm:p-4">Job Title</th>
          <th className="p-2 sm:p-4 hidden md:table-cell">Job Category</th>
          <th className="p-2 sm:p-4 hidden lg:table-cell">Company Name</th>
          <th className="p-2 sm:p-4">Applicant</th>
          <th className="p-2 sm:p-4 hidden lg:table-cell">Hired</th>
          <th className="p-2 sm:p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {displayedApplications.map((application) => (
          <tr key={application._id} className="text-xs sm:text-sm border-b">
            <td className="p-2 sm:p-4">
              <input
                type="checkbox"
                checked={selectedApplications.includes(application._id)}
                onChange={() => handleSelectApplication(application._id)}
              />
            </td>
            <td className="p-2 sm:p-4 truncate">{application?.job?.title}</td>
            <td className="p-2 sm:p-4 truncate hidden md:table-cell">{application?.job?.category}</td>
            <td className="p-2 sm:p-4 truncate hidden lg:table-cell">{application?.job?.companyName}</td>
            <td className="p-2 sm:p-4 truncate cursor-pointer" onClick={() => handleClick(application.user?._id)}>{application.user?.fullName || "Unknown"}</td>
            <td className="p-2 sm:p-4 hidden lg:table-cell">{application?.status}</td>
            <td className="p-2 sm:p-4">
              <div className="flex flex-wrap gap-2 justify-start">
                <button
                  onClick={() => handleJobStatusChange(application, "shortlisted")}
                  className="py-1 px-2 bg-green-500 text-white rounded-md text-xs sm:text-sm"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleJobStatusChange(application, "hired")}
                  className="py-1 px-2 bg-blue-500 text-white rounded-md text-xs sm:text-sm"
                >
                  Hire
                </button>
                <button
                  onClick={() => handleIndividualMessage(application)}
                  className="py-1 px-2 bg-gray-500 text-white rounded-md text-xs sm:text-sm"
                >
                  Message
                </button>
                <button
                  onClick={() => handleAddUserToExistingConversation(application._id)}
                  className="py-1 px-2 bg-yellow-500 text-white rounded-md text-xs sm:text-sm"
                >
                  Add To Existing Conversation
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default ApplicationsTable;