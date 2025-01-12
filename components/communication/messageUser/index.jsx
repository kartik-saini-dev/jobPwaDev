
"use client";

import { useEffect, useRef, useState, useContext } from "react";
import Sidebar from "@/components/communication/chatSideBar";
import ChatHeader from "@/components/communication/chatHeader";
import MessageList from "@/components/communication/messageList";
import MessageInput from "@/components/communication/messageInput";
import SideProfile from "@/components/communication/sideProfile";
import { socket } from "@/socket";
import { GlobalContext } from "@/context/index";
import { toast } from "sonner";
import { FiMenu } from "react-icons/fi";
import { getConversation } from "../../../services/conversations"

const MessageUser = () => {

  const [messagesData, setMessagesData] = useState([]);
  const [room, setRoom] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [conversationData, setConversationData] = useState(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);;
  const eventListenerAdded = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setPageLevelLoader, user, isAuthUser, conversationId } = useContext(GlobalContext);
  const userId = user?._id;

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  const roomRef = useRef(null);
  const socketRef = useRef(socket);

  // Fetch conversation and handle socket events
  useEffect(() => {
    const fetchAndHandleConversation = async () => {
      setIsLoading(true);

      if (!conversationId && !userId) {
        console.error("No conversation ID found.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch conversation data
        const conversation = await getConversation(conversationId, userId);

        if (conversation?.success) {
          setConversationData(conversation.conversation);

          const { _id, messages} = conversation.conversation;


          if (_id) {
            setMessagesData(messages || []);
            setRoom(_id);
            roomRef.current = _id;  // Store the room ID in the ref

            markMessagesAsSeen(_id);

            // Join the room for real-time updates
            socketRef.current.emit("joinRoom", { userRoom: _id, userId });

            // Handle real-time updates for participants for leave group to work
            const handleUpdateParticipants = (updatedParticipants) => {
              setConversationData((prevData) => ({
                ...prevData,
                participants: updatedParticipants,
              }));
            };

            // Handle real-time message updates
            const handleMessagesSeen = ({ unseenMessageIds, seenByUsers }) => {
              setMessagesData((prevMessages) =>
                prevMessages?.map((message) =>
                  unseenMessageIds?.includes(message._id)
                    ? { ...message, seenByUsers }
                    : message
                )
              );
            };

            socketRef.current.on("messagesSeen", handleMessagesSeen);
            socketRef.current.on("updateParticipants", handleUpdateParticipants);
            // Cleanup event listener on unmount or when conversation changes
            return () => {
              socketRef.current.off("updateParticipants", handleUpdateParticipants);
              socketRef.current.off("messagesSeen", handleMessagesSeen);
              socketRef.current.emit("leaveRoom", { userRoom: _id, userId });
            };
          }
        } else {
          console.error("Failed to load conversation:", conversation?.message);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const markMessagesAsSeen = (conversationId) => {
      try {
        socketRef.current.emit("markAsSeen", { userId, conversationId });
      } catch (error) {
        console.error("Error marking messages as seen:", error);
      }
    };

    fetchAndHandleConversation();

    // Cleanup when the component unmounts or when the conversation changes
    return () => {
      if (roomRef.current) {
        socketRef.current.off("updateParticipants");
        socketRef.current.off("messagesSeen");
        socketRef.current.emit("leaveRoom", { userRoom: roomRef.current, userId });
      }
    };
  }, [conversationId, userId]); // using ref for accurate leave and enter join room trigger

  // Scroll to the bottom of the messages container when userMessages changes
  useEffect(() => {
    if (messagesContainerRef.current) {

      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesData]);

  

  // Handle message updates and deletions
  useEffect(() => {
    socket.on('messageUpdated', ({ messageId, updatedText }) => {
      setMessagesData((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId ? { ...message, text: updatedText } : message
        )
      );
    });
    socket.on('messageDeleted', ({ messageId }) => {
      setMessagesData((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    });
    return () => {
      socket.off('messageUpdated');
      socket.off('messageDeleted');
    };
  }, []);



  const handleUpdateMessage = (messageId, updatedText) => {
    const isGroup = conversationData.participants.length > 2;

    socket.emit('updateMessage', {
      messageId,
      updatedText,
      isGroup,
      groupName: conversationData.groupName,
      conversationId: conversationData._id,
      participants: conversationData.participants,
      userRoom: room,
      sender: user?._id,
    });
  };

  const handleDeleteMessage = async (messageId, type, fileUrl) => {

    socket.emit("deleteMessage", {
      messageId,
      userRoom: room,
      sender: userId,
      isGroup: conversationData.participants.length > 2,
      conversationId: conversationData._id,
      participants: conversationData.participants,
    });


    if ((type === "File" || type === "Media" || type === "Document") && fileUrl) {
      try {

        const response = await fetch("/api/cloudinary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileURL: fileUrl }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Image deleted successfully from Cloudinary");
        } else {
          toast.error("Failed to delete image from Cloudinary:", data.message);
        }
      } catch (error) {
        toast.error("Error deleting image from Cloudinary:", error);
      }
    }

  };


  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // When a message is received, update the state with the new message
      setMessagesData((prev) => {
        if (!prev) {
          return [data]; // Add the received message
        }
        return [...prev, data]; // Append the received message
      });
    };

    if (!eventListenerAdded.current) {
      socket.on("sendmessage", handleReceiveMessage); // Listen for the sendmessage event
      eventListenerAdded.current = true;
    }

    return () => {
      socket.off("sendmessage", handleReceiveMessage); // Clean up the listener
      eventListenerAdded.current = false;
    };
  }, []);


  const sendMessage = (messageInput, setMessageInput, isSystem = false) => {
    if (conversationData && messageInput.trim()) {
      // Determine if the conversation is a group conversation
      const isGroup = conversationData.participants.length > 2;

    

      // Prepare the message data
      const messageData = {
        message: messageInput,
        from: user?._id,
        isGroup,
        type: isSystem ? "System" : "Text", // Mark system messages
        createdAt: new Date(),
        groupName: conversationData.groupName,
        conversationId: conversationData._id,
        userRoom: room,
        participants: conversationData.participants, // Use the filtered participants
      };

      // Emit to the server
      socket.emit("message", messageData);

      // Clear the message input
      setMessageInput("");
    }
  };


  const uploadToCloudinary = async (file) => {
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      toast.error("Cloudinary cloud name is not defined in environment variables.");
    }

    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", ""); // Steps to find or create the upload preset:
    // 1. Log in to your Cloudinary account.
    // 2. Go to the "Settings" page (click on your profile icon at the top-right corner).
    // 3. Navigate to the "Upload" tab in the settings.
    // 4. Scroll down to the "Upload Presets" section.
    // 5. Either create a new preset or use an existing one. Copy the preset name and use here

    formData.append("cloud_name", `${cloudName}`); 

    // Determine the Cloudinary URL based on file type
    const getUploadURL = (fileType) => {
      if (fileType.startsWith("image/")) {
        return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      } else if (fileType.startsWith("video/")) {
        return `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      } else {
        return `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`; // For documents or other files
      }
    };

    const uploadURL = getUploadURL(file.type);

    try {
      const response = await fetch(uploadURL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url; // Return the uploaded file URL
    } catch (error) {
      toast.error("Error uploading to Cloudinary:", error.message);
      throw error;
    }
  };
  const handleFileChange = async (file) => {
    if (!file) return;

    // Helper function to determine the file type
    const getFileType = (file) => {
      if (file.type.startsWith("image/")) {
        return "File"; // For images
      } else if (file.type.startsWith("video/")) {
        return "Media"; // For videos
      } else {
        return "Document"; // For other file types
      }
    };

    try {
      // Upload file to Cloudinary
      const fileUrl = await uploadToCloudinary(file);


      if (conversationData) {
        const isGroup = conversationData.participants.length > 2;
        const fileType = getFileType(file);

        // Prepare message data
        const messageData = {
          message: fileUrl,
          from: user?._id,
          isGroup: isGroup,
          type: fileType, // Dynamically assign file type
          createdAt: new Date(),
          groupName: conversationData.groupName, // For group messages
          conversationId: conversationData._id,
          userRoom: room,
          participants: conversationData.participants,
        };

        // Emit the message via socket
        socket.emit("message", messageData);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload the file.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row h-[85vh] m-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 shadow-xl">
      {isAuthUser || isLoading ? (
        <>
          {/* Show loading state if fetching the conversation */}
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 ">
              <div className="text-center max-w-md w-full">
                <h2 className="text-lg font-semibold mt-4 text-gray-700">Loading Conversation...</h2>
                <p className="text-sm text-gray-500">Please wait while we fetch your conversation data.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Show No Conversations if no conversation data is found */}
              {conversationData === null ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 ">
                  <div className="text-center max-w-md w-full">
                    <img
                      src="/cute.gif" // Replace with a suitable animation GIF
                      alt="No conversation"
                      className="w-48 h-48 mx-auto animate-bounce"
                    />
                    <h2 className="text-lg font-semibold mt-4 text-gray-700">No Conversations Yet</h2>
                    <p className="text-sm text-gray-500">Start a new conversation or select an existing one to get started.</p>
                  </div>
                </div>
              ) : (

                <>
                  {/* Hamburger Icon for Mobile/Tablet */}
                  <button
                    className="block  xl:hidden p-2 bg-gray-200 rounded-full shadow-md fixed top-4 left-4 z-50"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <FiMenu size={24} />
                  </button>

                  {/* Sidebar */}
                  <div
                    className={`fixed top-0 left-0 h-full  bg-white shadow-lg p-4 z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                      } transition-transform xl:static  xl:translate-x-0 xl:w-1/4 rounded-l-lg`}
                  >
                    <Sidebar />
                  </div>

                  {/* Overlay when Sidebar is open (only for phones/tablets) */}
                  {isSidebarOpen && (
                    <div
                      className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30 md:hidden"
                      onClick={() => setIsSidebarOpen(false)}
                    ></div>
                  )}

                  {/* Chat Content */}
                  <div className="flex flex-col w-full xl:w-2/4 h-full bg-white rounded-lg shadow-lg">

                    <ChatHeader conversationId={conversationData._id} groupPic={conversationData.groupPic} groupAdmin={conversationData.admin} participants={conversationData.participants} sendMessage={sendMessage} groupName={conversationData.groupName} />

                    <div className="flex-1 overflow-y-auto p-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/wallpaper.jpeg')" }} ref={messagesContainerRef}>
                      <MessageList
                        userMessages={messagesData || []}
                        participants={conversationData.participants}
                        room={room}
                        handleUpdateMessage={handleUpdateMessage}
                        handleDeleteMessage={handleDeleteMessage}
                      />
                    </div>
                    <div className="p-4 border-t">
                      <MessageInput
                        userMessages={messagesData || []}
                        sendMessage={sendMessage}
                        handleFileChange={handleFileChange}
                        room={room}
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <div className=" lg:block xl:w-1/4 lg:w-1/2 bg-white p-6 rounded-r-lg shadow-lg">
                    <SideProfile
                      groupAdmin={conversationData.admin}
                      participants={conversationData.participants}
                      groupPic={conversationData.groupPic}
                      groupName={conversationData.groupName}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      ) : (

        <div className="flex items-center justify-center w-full h-full bg-gray-100 ">
          <div className="text-center">
            <p className="text-lg font-semibold mt-4 text-gray-700">Login First</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageUser;