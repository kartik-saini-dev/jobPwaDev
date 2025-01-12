"use client";

import React, { useEffect, useState ,useContext} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { GlobalContext } from "@/context/index";

function MessageContext({ onClose }) {
   
  const {user,setConversationId}  = useContext(GlobalContext);
  const [conversations, setConversations] = useState([]);
  const [unseenCounts, setUnseenCounts] = useState({});
  const router = useRouter();

  // Fetch conversations and set up socket listener
 
  useEffect(() => {
    if (user) {
      const fetchConversations = async () => {
        try {
          const response = await axios.get(`/api/messages/get?sender=${user._id}`);
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



  const handleUserClick = (conversationId) => {
    // Reset unseen count for the clicked conversation
    setUnseenCounts((prevCounts) => ({
      ...prevCounts,
      [conversationId]: 0, // Set unseen count to 0
    }));

    // Update global state and navigate to inbox
    sessionStorage.setItem("conversationId", conversationId);
    setConversationId(conversationId);
    router.push("/inbox");
  };
  // Render unseen message count
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

  const renderUserProfilePic = (participant) => {
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
    }
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center rounded-full text-white font-bold">
        {participant?.fullName?.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div
      className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg p-4 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-4">Messages</h3>
      <div className="space-y-4 overflow-y-auto custom-scrollbar max-h-64">
        {conversations.length ? (
          conversations.map((conversation) => {
            const isGroupChat = !!conversation.groupName;
            const participants = conversation.participants || [];
            const lastMessage = conversation.lastMessage?.text || "No messages yet";
            const unseenCount = unseenCounts[conversation.conversationId] || 0;
            const isImageUrl = lastMessage.startsWith("https://res.cloudinary.com");

            // Determine display name
            const displayName = isGroupChat
              ? conversation.groupName
              : participants.find((u) => u._id !== user?._id)?.fullName || "Unknown User";

            return (
              <div
                key={conversation.conversationId}
                className="flex items-center p-3 rounded-lg transition-colors duration-300 cursor-pointer hover:bg-gray-100"
                onClick={() => handleUserClick(conversation.conversationId)}
              >
                {/* Profile Picture and Unseen Count */}
                <div className="relative mr-3">
                  {renderUnseenCount(unseenCount)}
                  {isGroupChat
                    ? renderUserProfilePic({ fullName: displayName })
                    : renderUserProfilePic(participants.find((u) => u._id !== user?._id))}
                </div>

                {/* Conversation Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800 truncate">
                      {displayName}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {isImageUrl ? "Image" : lastMessage.slice(0, 10) + "..."}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {isImageUrl ? (
                      <Image
                        src={lastMessage}
                        width={45}
                        height={45}
                        alt="Message Image"
                        className="max-w-[45px] max-h-[45px] object-cover"
                      />
                    ) : (
                      lastMessage
                    )}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400">No conversations found</div>
        )}
      </div>

      {/* Close Button */}
      <button
        className="w-full mt-4 py-2 bg-red-500 text-white rounded-md"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default MessageContext;
