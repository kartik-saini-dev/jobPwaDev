"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { GlobalContext } from "@/context";
import Pagination from "@/components/Home/Pagination"; // Adjust to your file structure
import {toast,Toaster} from "sonner";
// import CanvasAnimation from "@/components/canvasAnime/CanvasAnimation"; can see secong canvas animation dark mode
const Conversation = () => {
  const [scrollY, setScrollY] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState("groupName");
  const [groupName, setGroupName] = useState("");
  const router = useRouter();
  const { user , selectedUser,setConversationId } = useContext(GlobalContext);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/messages/get?sender=${user?._id}&page=${currentPage}`);

        setConversations(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, user?._id]);

  const handleConversationClick = (conversationId) => {
    sessionStorage.setItem('conversationId', conversationId);
        setConversationId(conversationId);
    router.push(`/inbox`);
  };
  const handleAddUserToConversation = async () => {
    if (!selectedConversationId || !selectedUser) return;
       
      setLoading(true);
    const payload = {
      conversationId: selectedConversationId,
      applicants: [selectedUser], // Wrap the selected user ID in an array as the API expects an array
      admin: user._id,  // Ensure you include the admin (assumed to be `user._id`)
      ...(groupName && { groupName }), // Include groupName if it exists
    };
  
    try {
      const {data}= await axios.post("/api/messages/createConversation", payload);
        
      if(data.success){
        setLoading(false);
         setGroupName("");
         setSelectedConversationId(null);
        toast.success("User added successfully! send message");
      }

    } catch (error) {
      setLoading(false);
      setGroupName("");
      setSelectedConversationId(null);
      console.error(error);
      toast.error("Failed to add user. Please try again.");
    }
  };
  

  const sortedConversations = [...conversations].sort((a, b) => {
    if (sortKey === "groupName") {
      return (a.groupName || "").localeCompare(b.groupName || "");
    }
    if (sortKey === "participants") {
      return (b.participants?.length || 0) - (a.participants?.length || 0);
    }
    return 0;
  });

  return (
    <div className="relative overflow-hidden bg-gray-800">
      <Toaster richColors />
      {/* Fullscreen Parallax Section */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url('/background.jpg')" }}
        ></div>

        <div
          className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{ left: `calc(50% - ${scrollY * 0.5}px)` }}
        >
          <Image src="/globe.png" alt="Globe" width={800} height={800} priority />
        </div>

        <div className="absolute top-1/2 left-1/2 z-30 transform -translate-x-1/2 -translate-y-1/2 opacity-90">
          <Image src="/people.png" alt="People" width={900} height={600} priority />
        </div>

        <div
          className={`absolute top-1/2 left-1/2 z-10 text-center text-white opacity-0 transition-opacity duration-700 ${scrollY > 50 ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.5}px)` }}
        >
          <h1 className="text-6xl font-bold mb-4 tracking-wide">Your Conversations</h1>
          <p className="text-2xl text-gray-300">Seamlessly connect with people worldwide.</p>
        </div>
      </section>

      {/* Conversations Section */}
      <div className="bg-gradient-to-b from-blue-50 to-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-between items-center mb-8">
            <span className="font-semibold text-lg">Sort by:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="groupName">Group Name</option>
              <option value="participants">Participants</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="loader border-4 border-blue-300 border-t-blue-500 rounded-full h-12 w-12 animate-spin"></div>
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-center text-gray-600">No conversations found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
              {sortedConversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  className={`relative bg-white shadow-lg rounded-lg w-64 p-6 flex flex-col items-center text-center ${
                    selectedConversationId === conv.conversationId ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <input
                    type="radio"
                    className="absolute top-2 left-2 h-5 w-5 cursor-pointer"
                    checked={selectedConversationId === conv.conversationId}
                    onChange={() => setSelectedConversationId(conv.conversationId)}
                  />
                  <div className="bg-blue-500 text-white rounded-full p-4 flex items-center justify-center w-16 h-16">
                    {conv.groupName ? (
                      <span className="text-2xl font-semibold">
                        {conv.groupName.charAt(0)}
                      </span>
                    ) : (
                      <i className="fas fa-user text-2xl"></i>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="font-bold text-lg text-gray-800">
                      {conv.groupName || `Conversation: ${conv.conversationId.substring(0, 6)}`}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {conv.participants?.length || 0} Participants
                    </p>
                  </div>
                  <button
                    onClick={() => handleConversationClick(conv.conversationId)}
                    className="mt-6 text-blue-500 font-semibold hover:underline"
                  >
                    Send Message
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Conditional Rendering of Add User / Create Group */}
          {selectedConversationId && (
            <div className="mt-8">
              {conversations.some(conv => conv.conversationId === selectedConversationId && conv.groupName) ? (
                <div>
                   <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Can change Group Name"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleAddUserToConversation}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    {loading ? " Adding..." :"Add User to Group"}
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter Group Name"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleAddUserToConversation}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    {loading ? "Creating..." : "Create Group To Add User"}
                  </button>
                </div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>
      {/* <CanvasAnimation /> */}
    </div>
  );
};

export default Conversation;
