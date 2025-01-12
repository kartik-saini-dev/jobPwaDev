"use client";
import { GlobalContext } from "@/context";
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";

export default function Unauthorized() {
  const { setPageLevelLoader } = useContext(GlobalContext);

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Subtle Background Circles */}
      <div className="absolute w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full px-6 sm:px-8 py-8 bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100"
      >
        {/* Content */}
        <div className="flex flex-col items-center text-center gap-6">
          <h1
            className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Unauthorized Access
          </h1>
          <p className="text-gray-300 text-lg">
            You need to <span className="font-semibold text-white">Login</span>{" "}
            first to view this page!
          </p>
          {/* Button */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/auth/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-500 transition duration-300 ease-in-out"
          >
            Go to Login
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
