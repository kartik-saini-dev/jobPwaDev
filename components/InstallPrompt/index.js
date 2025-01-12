"use client"
import React from 'react';
// components/InstallPrompt.jsx


const InstallPrompt = ({ onInstallClick, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50" /> {/* Background blur effect */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-lg p-6 rounded-lg z-50 max-w-sm w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-2xl hover:text-red-600 transition">
          &times; {/* Close icon */}
        </button>
        <h2 className="text-lg font-semibold text-center mb-4">Install Our App!</h2>
        <p className="text-gray-700 text-center mb-4">Get a better experience by installing our app on your device.</p>
        <button
          onClick={onInstallClick}
          className="bg-green-600 text-white font-bold px-4 py-2 rounded-md w-full hover:bg-green-700 transition"
        >
          Install
        </button>
      </div>
    </>
  );
};



export default InstallPrompt;