"use client";
import { useState, useRef, useContext } from "react";
import { toast,Toaster } from "sonner";
import { FiImage, FiVideo, FiFile, FiPaperclip, FiSmile } from "react-icons/fi"; // React Icons
import EmojiPicker from "emoji-picker-react";
import { socket } from "@/socket";
import { GlobalContext } from "@/context";

const MessageInput = ({ handleFileChange, sendMessage, room, userMessages }) => {
  const [messageInput, setMessageInput] = useState("");
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);
  const { user } = useContext(GlobalContext);

  // Check if the last message is a system message from the current user
  const isSystemMessageAndSender = userMessages && userMessages.length > 0 
    ? userMessages[userMessages.length - 1].type === "System" 
      && userMessages[userMessages.length - 1].from === user?._id
    : false;

  // Disable input and button if the condition is met
  const isMessageDisabled = isSystemMessageAndSender;


  const handleSendMessage = () => {
    if (!room) {
      toast.error("Conversation does not exist");
      return;
    }
  
    if (messageInput.trim() === "") {
      toast.warning("Message cannot be empty!");
      return;
    }
 
    sendMessage(messageInput, setMessageInput);

    // Emit stopTyping when the message is sent
    socket.emit("stopTyping", { room, userId: user?._id });
    setMessageInput(""); // Clear input field
  };

  const handleTyping = (e) => {
    const inputValue = e.target.value;
    setMessageInput(inputValue);

    if (inputValue.trim() === "") {
      socket.emit("stopTyping", { room, userId: user?._id });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    socket.emit("typing", { room, userId: user?._id, userName: user?.fullName });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { room, userId: user?._id, userName: user?.fullName });
    }, 2000);
  };

  const handleEmojiClick = (emojiData) => {
    setMessageInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false); // Close emoji picker after selecting an emoji
  };

  const handleAttachmentClick = (type) => {
    fileInputRef.current.setAttribute(
      "accept",
      type === "image" ? "image/*" : type === "video" ? "video/*" : "*"
    );
    fileInputRef.current.click();
    setShowAttachmentOptions(false);
  };

  const onFileChange = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];
  
    if (!file) return;

    setIsUploading(true);
    try {
      await handleFileChange(file);
      toast.success(
        `${
          file.type.includes("image")
            ? "Image"
            : file.type.includes("video")
            ? "Video"
            : "File"
        } uploaded successfully!`
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload the file.");
    } finally {
      setIsUploading(false);
      fileInput.value = ""; // in order to use same image again
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line from being added
      handleSendMessage();
    }
  };
  return (
    <div className="p-2 bg-gray-100 rounded-lg">
           <Toaster richColors />
      <div className="flex items-center space-x-2 sm:space-x-4 relative">
        {/* Attachment Button */}
        <div className="relative">
          <input
            type="file"
            onChange={onFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            className="flex items-center justify-center px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowAttachmentOptions((prev) => !prev)}
            disabled={isMessageDisabled}
          >
            <FiPaperclip className="mr-1 sm:mr-2 text-base sm:text-lg" />
            {isUploading ? "Uploading..." : "Attachment"}
          </button>
          {showAttachmentOptions && (
            <div className="absolute left-0 bottom-full mb-2 bg-white border border-gray-300 rounded-lg shadow-lg">
              <button
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                onClick={() => handleAttachmentClick("image")}
                disabled={isMessageDisabled}
              >
                <FiImage className="mr-2" />
                Upload Image
              </button>
              <button
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                onClick={() => handleAttachmentClick("file")}
                disabled={isMessageDisabled}
              >
                <FiFile className="mr-2" />
                Upload File
              </button>
              <button
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                onClick={() => handleAttachmentClick("video")}
                disabled={isMessageDisabled}
              >
                <FiVideo className="mr-2" />
                Upload Video
              </button>
            </div>
          )}
        </div>
  
        {/* Emoji Picker Button */}
        <div className="relative">
          <button
            className="flex items-center justify-center px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            disabled={isMessageDisabled}
          >
            <FiSmile className="text-base sm:text-lg" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
  
        {/* Message Input Field */}
        <input
          type="text"
          className="flex-grow p-1 sm:p-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={messageInput}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          disabled={isMessageDisabled}
        />
  
        {/* Send Button */}
        <button
          className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          onClick={handleSendMessage}
          disabled={isMessageDisabled || isUploading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
