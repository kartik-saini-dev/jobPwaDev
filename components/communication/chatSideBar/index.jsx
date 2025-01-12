

"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter,usePathname } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { GlobalContext } from "@/context/index";
import axios from "axios";

const Sidebar = () => {

  const router = useRouter();

  const { user,  conversations, unseenCounts,setConversationId, setConversations,conversationId,setUnseenCounts} = useContext(GlobalContext);
  const [searchQuery, setSearchQuery] = useState("");  // Track search input
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const pathname = usePathname();
  useEffect(() => {
    // Filter conversations based on search query
    if (searchQuery.trim() !== "") {
      const filtered = conversations.filter((conversation) => {
        const isGroupChat = !!conversation.groupName;
        const participants = conversation.participants;
        const displayName = isGroupChat ? conversation.groupName : participants[0]?.fullName;
        const lastMessage = conversation.lastMessage?.text || "";
        const lowerQuery = searchQuery.toLowerCase();
        
        // Filter by participant name, group name, or last message content
        return (
          displayName.toLowerCase().includes(lowerQuery) ||
          lastMessage.toLowerCase().includes(lowerQuery)
        );
      });

      setFilteredConversations(filtered);
    } else {
     
      setFilteredConversations(conversations);  // Reset if search is empty
    }
  }, [searchQuery, conversations]);


  useEffect(() => {
    if (user?._id) {
      const fetchConversations = async () => {
        try {
          const response = await axios.get(
            `/api/messages/get?sender=${user._id}`
          );
          if (response.data.success) {
            const fetchedConversations = response.data.data;
            setConversations(fetchedConversations);
             
            // Initialize unseen counts
            const unseen = {};
            fetchedConversations.forEach((conv) => {
              unseen[conv.conversationId] = conv.unseenCount || 0;
            });
           
            setUnseenCounts(unseen);
          }
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      };

      fetchConversations();
    }
  }, [user]);
  // const handleUserClick = (conversationId) => {
  //   const encodedId = btoa(conversationId); // Base64 encode the conversation ID

  //   router.push(`/inbox?conversationId=${encodedId}`);
  // };
  // below code have to use /inbox thats it when encoded conversation id 
  //import { useSearchParams } from 'next/navigation'

  //const searchParams = useSearchParams()

  // const conversationId = searchParams.get('conversationId')

  const handleUserClick = (conversationId) => {

    // Reset unseen count for the clicked conversation
    setUnseenCounts((prevCounts) => ({
      ...prevCounts,
      [conversationId]: 0, // Set unseen count to 0
    }));

    // Update global state and navigate to inbox
    sessionStorage.setItem("conversationId", conversationId);
    setConversationId(conversationId);

  };
  const getMessageType = (message) => {
    // If the message starts with a URL to Cloudinary
    if (message.startsWith("https://res.cloudinary.com")) {
      if (message.includes("/image/")) return "Image";
      if (message.includes("/video/")) return "Video";
      return "Document"; // Assuming other types of Cloudinary files are documents
    }

    return message.slice(0, 10) + "...";
  };
  const renderUserProfilePic = (participant, groupPic) => {
    const profilePic = participant?.avatar;

    if (profilePic) {
      return (
        <Image
          src={profilePic}
          alt="Profile"
          className="rounded-full border-2 border-gray-200 object-cover"
          width={40}
          height={40}
        />
      );
    } else if (groupPic) {
      
      return (
        <Image
          src={groupPic}
          alt="Group Profile"
          className="rounded-full border-2 border-gray-200 object-cover"
          width={40}
          height={40}
        />
      );
    }

    return (
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center rounded-full text-white font-bold">
        {participant?.fullName?.charAt(0).toUpperCase() || "G"}
      </div>
    );
  };

  const renderUnseenCount = (unseenCount) => {
    if (unseenCount > 0) {
      return (
        <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
          {unseenCount}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white text-gray-800 w-full max-w-xs h-full p-4 rounded-xl shadow-lg flex flex-col justify-between overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Chats</h2>
         {/* Search Bar */}
         <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
        <div className="space-y-4 overflow-y-auto custom-scrollbar">
        {filteredConversations.length ? (
            filteredConversations.map((conversation) => {
              const isGroupChat = !!conversation.groupName;
              const participants = conversation.participants;
              const lastMessage = conversation.lastMessage?.text || "No messages yet";
              const unseenCount = unseenCounts[conversation.conversationId] || 0;

              const lastMessageType = getMessageType(lastMessage);
              const displayName = isGroupChat
                ? conversation.groupName
                : participants[0]?.fullName;
              const isActive = conversation.conversationId === conversationId;

              return (
                <div
                  key={conversation.conversationId}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-300 cursor-pointer ${isActive ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  onClick={() => handleUserClick(conversation.conversationId)}
                >
                  <div className="relative mr-3">
                    {renderUnseenCount(unseenCount)}
                    {isGroupChat
                      ? renderUserProfilePic(null, conversation.groupPic) // Pass null for participant
                      : renderUserProfilePic(participants[0], null)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800 truncate">
                        {displayName}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {lastMessageType}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-400">No conversations found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;