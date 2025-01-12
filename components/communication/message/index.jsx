
"use client";

import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useState, useContext ,useEffect} from "react";
import Image from "next/image";
import { GlobalContext } from "@/context";
import { socket } from "@/socket";
const Message = ({
  participants,
  text,
  userId,
  type,
  createdAt,
  handleUpdate,
  handleDelete,
  seenBy,
  room,
  isLastMessage, // Track the last message
  isSystemMessage, // Flag to check if it's a system message
}) => {
  const { user } = useContext(GlobalContext);
  const currentUserId = user?._id;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const isSender = userId === currentUserId;
  const messageContainerClass = isSystemMessage
    ? "flex justify-center mb-4"
    : `mb-4 ${isSender ? "text-right" : "text-left"}`;
  const messageClass = isSystemMessage
    ? "bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm italic"
    : `p-5 space-x-0 rounded-lg inline-block ${
        isSender ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
      }`;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  useEffect(() => {
    if (isSystemMessage && isSender && room && user?._id) {
      // Emit the event only after the text is displayed
      socket.emit("leaveRoom", { userRoom: room, userId: user._id ,participants});
       sessionStorage.removeItem("conversationId");
    }
  }, [isSystemMessage, isSender, room, user?._id]);

  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleSaveEdit = () => {
    handleUpdate(editedText);
    setIsEditing(false);
  };

  const renderMedia = () => {
    if (text.startsWith("https://res.cloudinary.com")) {
      if (type === "File") {
        return (
          <>
            <div className="relative">
              <Image
                src={text}
                alt="Image"
                width={120}
                height={120}
                className="w-full max-w-xs object-cover rounded-lg cursor-pointer"
                onClick={openModal}
              />
            </div>
            {isModalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                onClick={closeModal}
              >
                <img
                  src={text}
                  alt="Full Screen Image"
                  className="max-w-full max-h-full rounded-lg"
                  onClick={(e) => e.stopPropagation()} // Prevent closing modal on image click
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white text-lg font-bold"
                >
                  ✖
                </button>
              </div>
            )}
          </>
        );
      } else if (type === "Media") {
        return (
          <video
            src={text}
            controls
            className="w-32 h-32 rounded-lg object-cover"
          />
        );
      }  else if (type === "Document") {
        return (
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black playfair_display underline"
          >
            View Document
          </a>
        );
      }
    }
    return null;
  };
  const renderSeenBy = () => {
    // Filter seenByOthers and remove duplicates based on _id
    const seenByOthers = seenBy
      ?.filter((user) => user._id !== currentUserId)
      ?.reduce((unique, user) => {
        if (!unique.some((u) => u._id === user._id)) {
          unique.push(user);
        }
        return unique;
      }, []);
  
    if (
      isSender &&
      isLastMessage &&
      seenByOthers?.length > 0 &&
      seenBy?.length > 0
    ) {
      return (
        <div className="mt-1 text-right">
          <span className="text-green-500 font-semibold mr-2">Seen By:</span>
          <div className="flex items-center space-x-2 justify-end">
            {seenByOthers.map((user) => (
              <div key={user._id} className="flex items-center space-x-1">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.fullName}
                    width={20}
                    height={20}
                    className="rounded-full"
                    title={user.fullName}
                  />
                ) : (
                  <div className="bg-blue-500 text-white h-6 w-6 flex items-center justify-center rounded-full">
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : ""}
                  </div>
                )}
                <span className="text-xs text-gray-500">{user.fullName}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  

  return (
    <div className={messageContainerClass}>
      <div>
        {isSystemMessage ? (
          <div className={messageClass}>{text}</div>
        ) : (
          <>
            <div className="inline-block">
              <span className="text-xs">
                {isEditing ? (
                  <div className="text-right">
                    <button
                      className="mr-2 bg-green-500 text-white h-6 px-2"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 text-white h-6 px-2"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {isSender &&
                      (type === "Text") && (
                        <FaPencilAlt
                          className="text-gray-500 hover:text-blue-600 mr-2 inline-block h-6 w-6 cursor-pointer"
                          onClick={handleEditToggle}
                        />
                      )}
                    {isSender && (
                      <FaTrashAlt
                        className="h-6 w-6 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={handleDelete}
                      />
                    )}
                  </>
                )}
              </span>
            </div>

            <div className={`${messageClass} ${type === "File" ? "p-0" : ""}`}>
              {isEditing ? (
                <input
                  className="w-full bg-transparent rounded-none outline-0"
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              ) : (type === "File" || type === "Media" || type === "Document") ? (
                renderMedia()
              ) : (
                <span className="block text-left">{text}</span>
              )}
            </div>
          </>
        )}
      </div>

      {!isSystemMessage && (
        <div className="mt-2 text-xs text-gray-500">
          {renderSeenBy()}
          <span>
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default Message;
