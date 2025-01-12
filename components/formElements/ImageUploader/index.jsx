"use client"
import React, { useState } from "react";
import { FiTrash2, FiLoader } from "react-icons/fi";

const ImageUploader = ({ files, setFiles, onUpload, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const fileInput = e.target; // Access the input element
  const uploadedFiles = Array.from(fileInput.files); 
    const uploadedUrls = [];
    setLoading(true);

    for (const file of uploadedFiles) {
      try {
        const url = await onUpload(file);
        uploadedUrls.push(url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setFiles((prev) => [...prev, ...uploadedUrls]);
    setLoading(false);
    fileInput.value = "";
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md">
      <label className="block text-sm font-semibold mb-3 text-gray-800">
        Upload Images
      </label>
      <div className="flex items-center gap-4">
        <label
          className={`flex items-center justify-center w-40 p-2 bg-blue-500 text-white font-medium rounded-lg shadow-md cursor-pointer transition duration-300 ${loading ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          htmlFor="file-upload"
        >
          <span className="flex items-center gap-2">
            {loading ? <FiLoader className="animate-spin" /> : "Choose Files"}
          </span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={file}
              alt={`Uploaded ${index}`}
              className="w-full h-32 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                onDelete(file);
              }}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 shadow-md"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
