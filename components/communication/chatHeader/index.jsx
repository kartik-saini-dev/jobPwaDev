

"use client"

import moment from 'moment';
import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { GlobalContext } from '@/context';
import { socket } from '@/socket';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { HiDotsVertical } from 'react-icons/hi'; // Importing a 3-dots icon (react-icons)

const ChatHeader = ({ participants, groupName, sendMessage, groupAdmin, conversationId, groupPic }) => {
  const [localTime, setLocalTime] = useState();
  const {  user, setPageLevelLoader } = useContext(GlobalContext);
  const [typingUsers, setTypingUsers] = useState(false);
  const [showParticipantsContext, setShowParticipantsContext] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for menu visibility
  const router = useRouter();
  useEffect(() => {
    const updateLocalTime = () => {
      const currentDate = new Date();
      setLocalTime(
        currentDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })
      );
    };
    updateLocalTime();
    const intervalId = setInterval(updateLocalTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    socket.on("userTyping", ({ userId, userName }) => {
      if (userId !== user?.id) {
        setTypingUsers((prev) => {
          // Ensure prev is an array before calling .find or .filter
          return Array.isArray(prev)
            ? prev.find((u) => u.userId === userId)
              ? prev
              : [...prev, { userId, userName }]
            : [{ userId, userName }]; // If prev is not an array, create a new one
        });
      }
    });

    socket.on("userStoppedTyping", ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [user]);

  const calculateLastSeen = (lastSeenTimestamp) => {
    if (!lastSeenTimestamp) return 'N/A';
    const now = moment();
    const lastSeen = moment(lastSeenTimestamp);
    const duration = moment.duration(now.diff(lastSeen));
    if (duration.asSeconds() < 60) return 'Just now';
    if (duration.asMinutes() < 60) return `${Math.floor(duration.asMinutes())} minutes ago`;
    if (duration.asHours() < 24) return `${Math.floor(duration.asHours())} hours ago`;
    if (duration.asDays() < 30) return `${Math.floor(duration.asDays())} days ago`;
    return 'More than a month ago';
  };

  const handleContextToggle = () => {
    setShowParticipantsContext(!showParticipantsContext);
  };
  // Toggle the 3-dots menu
  const toggleMenu = () => setShowMenu(!showMenu);


  const handleMenuAction = async (action) => {
    try {
      const response = await axios.post("/api/messages/manage", {
        action,
        conversationId, // Replace with your actual conversation ID
        userId: user?._id, // Replace with your actual user ID
      });


      if (response.data.success) {

        // Handle UI updates here based on the action
        if (action === "delete" || action === "deleteConversation") {

          location.reload();


        } else if (action === "leave") {
          sendMessage(
            `${user?.fullName || "A user"} has left the conversation.`,
            () => { }, // No need to clear input for system messages
            true, // Set `isSystem` to true
          );
     
        }
      } else {
        console.error("Action failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error performing action:", error.message);
    } finally {
      setShowMenu(false);
    }
  };
  const renderUserProfilePic = (participants, groupPic) => {
    const profilePic = participants?.find((p) => p._id !== user?._id)?.avatar
    const fullName = participants?.find((p) => p._id !== user?._id)?.fullName

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
        {fullName?.charAt(0).toUpperCase() || "G"}
      </div>
    );
  };

  const handleClick = (userId) => {
    setShowParticipantsContext(false);
    setPageLevelLoader(true)
    router.push(`/user/${userId}`)
  }
  const onlineStatus = participants.find((p) => p._id !== user?._id)?.online;
  const otherParticipant = participants.find((p) => p._id !== user?._id);
  // Determine the header display name
  const displayName = groupName
    ? groupName
    : participants.length === 2
      ? participants.find((p) => p._id !== user?._id)?.fullName || 'Unknown User'
      : 'Group Chat';

  const isGroupAdmin = groupAdmin?._id === user?._id;
   

  return (
    <>
      <div className="flex items-center p-4 border border-gray-200 rounded relative">
        <div className="flex items-center">
          <div className="relative mr-3">
            {groupName
              ? renderUserProfilePic(null, groupPic) // Pass null for participant
              : renderUserProfilePic(participants, null)}
            {onlineStatus && !groupName && (
              <span className="absolute top-0 right-0 bg-green-500 w-3 h-3 rounded-full"></span>
            )}
          </div>

          <div className="relative">
            <div className="text-lg font-bold cursor-pointer">{displayName}</div>
            {otherParticipant && !groupName && !onlineStatus && (
              <p>Last seen: {calculateLastSeen(otherParticipant.lastSeen)}</p>
            )}
            <p className="text-gray-500">Local time: {localTime}</p>
            {typingUsers.length > 0 && (
              <p className="text-blue-500 text-sm">
                {typingUsers.map((user) => user.userName).join(', ')} typing...
              </p>
            )}
          </div>

          {/* Button to toggle participants */}

        </div>

        {/* Right-side 3-dots menu */}
        <div className="ml-auto relative">
          <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <HiDotsVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute z-20 right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              {groupName && (
                <button
                  onClick={handleContextToggle}
                  className="w-full text-blue-500 hover:bg-gray-100 py-2 px-4 text-left"
                >
                  Show Participants
                </button>
              )}
              {groupName && isGroupAdmin ? (
                <>
                  <button
                    onClick={() => handleMenuAction("delete")}
                    className="w-full text-red-500 hover:bg-gray-100 py-2 px-4 text-left"
                  >
                    Delete Group
                  </button>
                </>
              ) : null}
              {!groupName && (
                <button
                  onClick={() => handleMenuAction("deleteConversation")}
                  className="w-full text-red-500 hover:bg-gray-100 py-2 px-4 text-left"
                >
                  Delete Conversation
                </button>
              )}
              {groupName && !isGroupAdmin ? (
                <button
                  onClick={() => handleMenuAction("leave")}
                  className="w-full text-blue-500 hover:bg-gray-100 py-2 px-4 text-left"
                >
                  Leave Group
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Participants Context */}
      {showParticipantsContext && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-4/5 md:w-1/3 max-w-lg overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Participants</h2>
            <ul className="space-y-4">
              {participants.map((p) => (
                <li
                  key={p.userId}
                  className="flex items-center mb-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300 ease-in-out"
                >
                  {p.avatar ? (
                    <Image
                      src={p.avatar}
                      alt={p.fullName}
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-gray-300 shadow-sm"
                    />
                  ) : (
                    <div className="bg-purple-500 h-12 w-12 flex items-center justify-center rounded-full">
                      <span className="text-xl text-white font-bold">
                        {p.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="ml-4 flex-1">
                    <p
                      className="font-semibold text-gray-800 hover:text-blue-500 transition-colors duration-200"
                      onClick={() => handleClick(p._id)}
                    >
                      {p.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {p.online ? 'Online' : `Last seen: ${calculateLastSeen(p.lastSeen)}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowParticipantsContext(false)}
              className="mt-4 text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
