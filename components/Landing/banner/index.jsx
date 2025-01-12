"use client";
import { useEffect,useContext } from "react";
import { motion } from "framer-motion";
import TypingEffect from "react-typing-effect";
import { GlobalContext } from "@/context"; 
const Banner = () => {

  const { setPageLevelLoader } = useContext(GlobalContext); // Access context

  useEffect(() => {
    // Set the loader to false when this component mounts
    setPageLevelLoader(false);

    // Optional: Return a cleanup function if needed
    return () => {
      // Any cleanup logic (if necessary)
    };
  }, [setPageLevelLoader]);

  return (
    <div className="relative bg-gradient-to-r from-blue-800 via-purple-800 to-black text-white py-20 overflow-hidden h-[100vh]">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        autoPlay
        loop
        muted
      >
        <source src="/ai-tech-background.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 h-full">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 text-center md:text-left"
        >
          {/* Typing Animation Heading */}
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-600"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <TypingEffect
              text={[
                "Unlock AI-Powered Opportunities",
                "Your Career Evolution Starts Here",
                "Step Into the Future of Jobs",
              ]}
              speed={100}
              eraseSpeed={50}
              eraseDelay={2000}
              typingDelay={500}
            />
          </h1>

          {/* Subtext */}
          <p
            className="mt-4 text-lg text-gray-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Step into the future with personalized job recommendations driven
            by AI. Your career evolution starts here.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex justify-center md:justify-start space-x-6">
            {/* Get Started Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-teal-400 text-black font-semibold rounded-full shadow-2xl hover:bg-gradient-to-r from-teal-400 to-cyan-400 hover:text-black transition-all duration-300 ease-in-out"
            >
              Get Started
            </motion.button>

            {/* Learn More Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 font-medium rounded-full shadow-2xl hover:bg-cyan-400 hover:text-black transition-all duration-300 ease-in-out"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
