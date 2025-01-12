"use client";


import { createContext, useDebugValue, useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { socket } from "@/socket";

export const GlobalContext = createContext(null);



export default function GlobalState({ children }) {
  const [showNavModal, setShowNavModal] = useState(false);
  const [pageLevelLoader, setPageLevelLoader] = useState(false);
  const [likes, setLikes] = useState({});
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: "",
  });
  const [isAuthUser, setIsAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]); // State for applied jobs
  const [followers, setFollowers] = useState([]);
  const [filterData, setFilterData] = useState([]); 
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    tier: "",
    credits : 0,
    price : 0
  });
//user
  const [avatar, setAvatar] = useState(""); 
  const [userType, setUserType] = useState(""); 
  // For managing unseen message counts
  const [unseenCounts, setUnseenCounts] = useState({});
  const [unseenMessages, setUnseenMessages] = useState(0);

  // For conversations fetched
  const [conversations, setConversations] = useState([]);

  const [isFollowing, setIsFollowing] = useState(); // Keyed by recruiterId

  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (Cookies.get("my-cookie")) {   // if refresh and if browser closed and open website again 
    
      const userData = JSON.parse(localStorage.getItem("user")) || {};

      if (Object.keys(userData).length > 0) {
        setUser(userData);
        setIsAuthUser(true);
    }
  
      // Initialize appliedJobs and followers from userData
      setAppliedJobs(userData.appliedJobs || []);
      setFollowers(userData.followers || []);
    } else {
      localStorage.removeItem("user")
      setIsAuthUser(false);
      setUser({});
      setAppliedJobs([]);
      setFollowers([]);
    }
  }, []);

 

  useEffect(()=>{
    const convId = sessionStorage.getItem("conversationId");
       if(convId){
          setConversationId(convId);

       }
  },[]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const updateUserStatus = async (status) => {
    if (user?._id) {
     
      try {
        await axios.put(`/api/register/update?userId=${user?._id}&status=${status}`);
      
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  };

  useEffect(() => {

    if (user?._id) {
          updateUserStatus("true")
      // Set user status to "offline" when the tab/browser is closed
      const handleUnload = () => {
        updateUserStatus("false");

         setIsAuthUser("false")
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [user]);

  

  const fetchUnseenMessageCount = async () => {
    try {

      const { data } = await axios.get(`/api/unseenCount?userId=${user?._id}`);

      if (data.success) {

        setUnseenMessages(data.unseenMessageCount) // first mount unseenmessages notification on message icon
        setUserType(data.userType);
        setAvatar(data.avatar);
      } else {
        console.error("Failed to fetch unseen message count:", data.message);
      }
    } catch (error) {
      console.error("Error fetching unseen message count:", error);
    }
  };

  useEffect(() => {

    if (user?._id) {
      fetchUnseenMessageCount();
    }
  }, [user]);



// Socket event listeners for unseen counts
useEffect(() => {
  if (!user?._id) return; // Exit early if user ID is not available

  // Emit 'setup' only once when the component mounts and the user is available
  socket.emit("setup", { userId: user._id });

  // Handle unseen messages
  const handleUnseenReceived = ({ count, to, from ,totalUnseen}) => {
    if (to === user._id) {
      setUnseenCounts((prevCounts) => ({ // unseencounts are live for users and group
        ...prevCounts,
        [from]: count,
      }));
    }

    setUnseenMessages(totalUnseen);// real time total unseen messages in order to show on message icon
  };

  const handleReduceUnseen = ({ unseenMessagesCount }) => {
    setUnseenMessages((prev) => Math.max(0, prev - unseenMessagesCount)); //unseenmessages is for message  icon which show total 
  };

  const handleClearUnseen = ({ to, from }) => {
    if (to === user._id) {
      setUnseenCounts((prevCounts) => ({
        ...prevCounts,
        [from]: 0, // Clear unseen count for the sender
      }));
    }
  };

  // Attach event listeners
  socket.on("unseenReceived", handleUnseenReceived);
  socket.on("reduceUnseen", handleReduceUnseen);
  socket.on("clearUnseen", handleClearUnseen);

  // Cleanup event listeners when the component unmounts
  return () => {
    socket.off("unseenReceived", handleUnseenReceived);
    socket.off("reduceUnseen", handleReduceUnseen);
    socket.off("clearUnseen", handleClearUnseen);
  };
}, [user?._id]);

  return (
    <GlobalContext.Provider
      value={{
        showNavModal,
        setShowNavModal,
        pageLevelLoader,
        setPageLevelLoader,
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        componentLevelLoader,
        setComponentLevelLoader,
        appliedJobs,
        followers,
        isPaymentProcessing,
        setIsPaymentProcessing,
        checkoutData,
        setCheckoutData,
        conversationId,
        setConversationId,
        selectedUser,
        setSelectedUser,
        filterData,
        setFilterData,
        likes,
        setLikes,
        isFollowing,
        setIsFollowing,
        isApplied,
        setIsApplied,
        conversations, 
        setConversations,
        unseenCounts,   
        unseenMessages,  
        setUnseenMessages,
        setUnseenCounts,
        avatar,
        setAvatar,
        userType,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}