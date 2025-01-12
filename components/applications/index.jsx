


"use client";
import { useState, useContext, useRef,useEffect } from "react";
import { GlobalContext } from "@/context";
import { Toaster, toast } from "sonner";
import Pagination from "@/components/Home/Pagination";
import SortingOptions from "./applicationElements/sortingOptions";
import GroupConversationForm from "./applicationElements/groupConversation";
import ApplicationsTable from "./applicationElements/applicationTable";
import { updateStatusApplication } from '@/services/application'
import { createConversation } from "@/services/conversations"
import { usePageState } from "@/lib/hooks/customhooks";
import { useRouter } from "next/navigation";

const JobApplicationList = ({ userJobApplications }) => {


 
  const { user, setSelectedUser ,setConversationId,setPageLevelLoader} = useContext(GlobalContext);
  const [sortKey, setSortKey] = useState("title");
  const [displayedApplications, setDisplayedApplications] = useState(userJobApplications);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef(null);
  const router = useRouter();
  const [page, handlePageChange] = usePageState(`${userJobApplications._id}`, 1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(userJobApplications?.length / itemsPerPage);

  const sortedApplications = [...displayedApplications].sort((a, b) => {
    if (sortKey === "title") {
      return a.user?.fullName.localeCompare(b.user?.fullName);
    }
    return 0;
  });
  
  useEffect(()=>{

  setPageLevelLoader(false);

  },[]);

  const displayedJobApplications = sortedApplications.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleJobStatusChange = async (application, action) => {
    if (Object.keys(user).length === 0) {
      toast.error("You need to log in to perform actions related to hiring.");
      return;
    }
 
    // setComponentLevelLoader({ loading: true, jobId: application._id });

    try {
      const response = await updateStatusApplication({
        applicationId: application._id,
        action,
      });

      if (response.success) {
        const updatedApplications = sortedApplications.map((app) => {
          if (app._id === application._id) {
            return { ...app, status: action === "shortlisted" ? "shortlisted" : "hired" };
          }
          return app;
        });
        setDisplayedApplications(updatedApplications);
        toast.success(`Successfully ${action === "shortlisted" ? "shortlisted" : "hired"} the applicant.`);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred while processing your request.");
    } finally {
      // setComponentLevelLoader({ loading: false, jobId: null });
    }
  };

  const handleIndividualMessage = async (application) => {
    if (!application) {
      toast.error("Invalid applicant data.");
      return;
    }

    // setComponentLevelLoader({ loading: true, jobId: null });

    try {
      // Prepare the applicants array with the selected user's ID and the current user's ID
      const applicants = [application.user._id, user._id];

      // Call the conversation creation service
      const response = await createConversation({
        groupName: null, // No group name for individual conversations
        applicants,
        admin: user?._id
      });

      if (response.success) {
    

        // Store the conversation ID in sessionStorage
        sessionStorage.setItem('conversationId', response.convId);
        setConversationId(response.convId);
        toast.success("Conversation created successfully.");
        // Navigate to /inbox without the conversationId in the URL
        router.push('/inbox');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error creating individual conversation:", error);
      toast.error("An error occurred while creating the conversation.");
    } finally {
      // setComponentLevelLoader({ loading: false, jobId: null });
    }
  };
  const uploadToCloudinary = async (file) => {

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      toast.error("Cloudinary cloud name is not defined in environment variables.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "....."); // Replace with your upload preset
    formData.append("cloud_name", `${cloudName}`);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleImageChange = async(e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
    e.target.value = null; // in order to use same image again
  };

  // Handle cropping
  const handleCrop = async (dataURL) => {
   
    setCroppedImage(dataURL); // Set the cropped image state
  
    try {
      // Upload the cropped image to Cloudinary
      const uploadedImageUrl = await uploadToCloudinary(dataURL);
    
  
      setCroppedImage(uploadedImageUrl); // Replace the cropped image with Cloudinary URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };
  

  // Handle delete image
  const handleDeleteImage = async () => {
 
    setLoading(true); // Start upload state
    try {
      const response = await fetch("/api/cloudinary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileURL: croppedImage }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Image deleted successfully from Cloudinary");
        setFile(null); // Clear the local file state
        setCroppedImage(null); // Clear cropped image
      } else {
        toast.error("Failed to delete image from Cloudinary: Try again ") ;
      }
    } catch (error) {
      toast.error("Error deleting image from Cloudinary: " + error);
    } finally {
      setLoading(false); // End upload state
    }
  };

  // Handle selection of applications
  const handleSelectApplication = (applicationId) => {
    setSelectedApplications((prevState) => {
      if (prevState.includes(applicationId)) {
        return prevState.filter((id) => id !== applicationId);
      } else {
        return [...prevState, applicationId];
      }
    });
  };

  // Add user to existing conversation
  const handleAddUserToExistingConversation = async (applicationId) => {
    const application = displayedApplications.find((app) => app._id === applicationId);
    if (!application) {
      toast.error("Invalid application data.");
      return;
    }

    setSelectedUser(application.user._id); // Set the selected user's ID in context
    router.push(`/conversations`); // Navigate to the conversations page
  };

  const handleCreateGroupConversation = async () => {
    if (selectedApplications.length === 0 || !groupName) {
      toast.error("Please select applicants and provide a group name.");
      return;
    }

    setUploading(true);
    // setComponentLevelLoader({ loading: true, jobId: null });

    try {
      // Get the selected user IDs
      const selectedUserIds = selectedApplications.map(applicationId => {
        const application = displayedApplications.find(app => app._id === applicationId);
        return application.user._id;
      });

      // Add the current user's ID from context
      const applicants = [user._id, ...selectedUserIds];
           
      // Call the conversation creation service
      const response = await createConversation({
        groupName,
        applicants,
        admin: user?._id,
        groupPic:croppedImage
      });

      if (response.success) {
       
        // Store the conversation ID in sessionStorage
        sessionStorage.setItem('conversationId', response.convId);
        setConversationId(response.convId);
        toast.success("Group conversation created successfully.");
        // Navigate to /inbox without the conversationId in the URL
        router.push('/inbox');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error creating group conversation:", error);
      toast.error("An error occurred while creating the group conversation.");
    } finally {
      setUploading(false);
      // setComponentLevelLoader({ loading: false, jobId: null });
    }
  };
          
  return (
    <div className="p-2 sm:p-4 bg-gray-50 min-h-screen">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center playfair_display">
        Job Applications
      </h2>
      <SortingOptions sortKey={sortKey} setSortKey={setSortKey} />

      {selectedApplications.length > 0 && (
        <GroupConversationForm
          groupName={groupName}
          setGroupName={setGroupName}
          file={file}
          croppedImage={croppedImage}
          handleImageChange={handleImageChange}
          handleImageDelete={handleDeleteImage}
          handleCrop={handleCrop}
          uploading={uploading}
          onCreateGroup={handleCreateGroupConversation}
          loading={loading}
        />
      )}

      <ApplicationsTable
        displayedApplications={displayedJobApplications}
        selectedApplications={selectedApplications}
        setSelectedApplications={setSelectedApplications}
        handleSelectApplication={handleSelectApplication}
        handleJobStatusChange={handleJobStatusChange}
        handleIndividualMessage={handleIndividualMessage}
        handleAddUserToExistingConversation={handleAddUserToExistingConversation}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      <Toaster />
    </div>
  );
};

export default JobApplicationList;
