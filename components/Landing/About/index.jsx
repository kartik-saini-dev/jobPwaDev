"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row items-center md:space-x-12">
          {/* Image Section */}
          <div
            className="md:w-1/2"
            data-aos="fade-right"
          >
            <img
              src="/job-hunting.jpg"
              alt="About Us"
              className="w-full rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Text Section */}
          <div
            className="md:w-1/2 mt-8 md:mt-0"
            data-aos="fade-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              About Us
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We are dedicated to connecting talented individuals with their dream
              opportunities while helping companies find the right candidates.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Our mission is to empower job seekers and companies by providing
              innovative tools and insights that drive professional success. With
              a vision to create a world where every individual finds their dream
              job, we are committed to fostering integrity, innovation, and
              inclusivity in everything we do.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Join us on this journey to redefine the job-seeking experience and
              help you unlock your true potential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
