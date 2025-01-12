"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Services = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const services = [
    {
      title: "Job Matching",
      description:
        "Find the perfect job tailored to your skills and aspirations with our AI-driven matching system.",
      icon: "/real-estate-property.jpg",
    },
    {
      title: "Resume Building",
      description:
        "Create a professional resume that stands out to recruiters using our easy-to-use tools.",
      icon: "/real-estate-property1.jpg",
    },
    {
      title: "Career Guidance",
      description:
        "Get expert advice to navigate your career path and achieve your professional goals.",
      icon: "/softeng.png",
    },
    {
      title: "Interview Preparation",
      description:
        "Ace your interviews with tips and mock interviews designed by industry professionals.",
      icon: "/mechanical.jpg",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-gray-800">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore the range of services we offer to help you achieve your career goals.
          </p>
        </div>

        {/* Carousel */}
        <Slider {...settings}>
          {services.map((service, index) => (
            <div key={index} className="p-6">
              <div
                className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row items-center"
                data-aos="fade-up"
              >
                {/* Image */}
                <div className="md:w-1/3 w-full">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="object-cover w-full h-48 md:h-full"
                  />
                </div>

                {/* Content */}
                <div className="p-8 md:w-2/3 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Services;
