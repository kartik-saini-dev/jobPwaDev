"use client";

import { GlobalContext } from "@/context";
import {  useContext } from "react";
import { useRouter } from "next/navigation";

const Pricing = () => {
  const router = useRouter();
  const { setCheckoutData,setPageLevelLoader } = useContext(GlobalContext);
  const pricingPlans = [
    {
      tier: "Basic",
      price: 9, // Numerical value for price
      period: "per month",
      credits: [5, "Can apply up to 5 jobs"],
      features: ["Access basic features", "5 job applications per month"],
      buttonText: "Get Started",
      popular: false,
    },
    {
      tier: "Pro",
      price: 29, // Numerical value for price
      period: "per month",
      credits: [10, "Can apply up to 10 jobs"],
      features: ["Access pro features", "10 job applications per month", "Priority support"],
      buttonText: "Get Started",
      popular: true,
    },
    {
      tier: "Enterprise",
      price: 99, // Numerical value for price
      period: "per month",
      credits: [15, "Can apply up to 15 jobs"],
      features: ["Access all features", "15 job applications per month", "Dedicated account manager"],
      buttonText: "Contact Us",
      popular: false,
    },
  ];

  const handleCheckout = (plan) => {
    setPageLevelLoader(true);
    setCheckoutData({
      tier : plan.tier,
      credits:plan.credits[0],
      price: plan.price
    });
    router.push('/checkout');
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 via-gray-50 to-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section tier */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Pricing Plans
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find the perfect plan to grow your business.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative group border ${
                plan.popular
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white"
              } rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-3`}
            >
              {/* Popular Tag */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-sm font-semibold py-1 px-4 rounded-tr-lg rounded-bl-lg animate-pulse">
                  Popular
                </div>
              )}

              {/* Plan Details */}
              <div className="p-8">
                <h3
                  className={`text-2xl font-bold text-center ${
                    plan.popular ? "text-indigo-600" : "text-gray-800"
                  }`}
                >
                  {plan.tier}
                </h3>
                <p className="text-center text-gray-500 mt-2">
                  <span className="text-4xl font-extrabold text-gray-800">
                    ${plan.price}
                  </span>{" "}
                  <span className="text-sm">{plan.period}</span>
                </p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center space-x-2 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => handleCheckout(plan)}
                    className={`px-6 py-3 w-full font-semibold text-white rounded-lg transform transition-transform duration-300 ${
                      plan.popular
                        ? "bg-indigo-600 hover:scale-105 hover:bg-indigo-700"
                        : "bg-gray-800 hover:scale-105 hover:bg-gray-900"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
