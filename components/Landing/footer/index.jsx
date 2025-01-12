"use client";

import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      {/* Top Section: Call to Action */}
      <div className="bg-gray-900 text-white text-center py-8 px-4">
        <h2 className="text-3xl font-bold mb-2">Join now and get 30% OFF!</h2>
        <p className="text-lg mb-4">
          Don't miss out on this exclusive offer that will end soon.
        </p>
        <button className="px-6 py-2 bg-white text-gray-800 font-semibold rounded hover:bg-gray-300 transition">
          Find Job
        </button>
      </div>

      {/* Footer Section */}
      <footer className="text-gray-600 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          {/* Left Section */}
          <div className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
            Job Portal
          </div>

          {/* Center Navigation Links */}
          <ul className="flex space-x-6 mb-4 md:mb-0">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Company
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Team
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Blog
              </a>
            </li>
          </ul>

          {/* Right Section: Social Media */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-gray-800 transition duration-200"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="hover:text-gray-800 transition duration-200"
              aria-label="YouTube"
            >
              <FaGithub />
            </a>
            <a
              href="#"
              className="hover:text-gray-800 transition duration-200"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-gray-800 transition duration-200"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          &copy; 2024 Made with Material Tailwind by Creative Tim.
        </div>
      </footer>
    </>
  );
};

export default Footer;
