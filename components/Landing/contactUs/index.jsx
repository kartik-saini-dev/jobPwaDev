"use client";

import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const { data } = await axios.post("/api/contactUs", formData);
      setResponseMessage(data.message || "Message sent successfully!");
    } catch (error) {
      setResponseMessage(error.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We'd love to hear from you! Feel free to reach out with any
            questions or inquiries.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Contact Form */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Your message"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className={`w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>

            {responseMessage && (
              <p className="mt-4 text-center text-gray-700">{responseMessage}</p>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">support@example.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Address</h3>
              <p className="text-gray-600">
                123 SaaS Lane, Suite 400 <br />
                San Francisco, CA 94107
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Follow Us</h3>
              <div className="flex space-x-4 mt-4">
                <motion.a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaFacebookF className="text-2xl" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaTwitter className="text-2xl" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaLinkedinIn className="text-2xl" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaInstagram className="text-2xl" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
