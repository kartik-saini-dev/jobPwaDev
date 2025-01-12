"use client";
import React, { useState,useContext,useEffect } from 'react';
import Link from 'next/link';
import { GlobalContext } from "@/context";
import { Toaster,toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerNewUser } from "@/services/register"; // Import your existing login function
import ComponentLevelLoader from "@/components/Loader/componentlevel";

// Password Strength Indicator Component
const PasswordStrengthBar = ({ strength }) => {
  const getColor = () => {
    if (strength === 100) return 'bg-green-500';
    if (strength >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full h-2 mt-3 bg-gray-300 rounded-lg overflow-hidden">
      <div className={`h-full ${getColor()} transition-all duration-300`} style={{ width: `${strength}%` }}></div>
    </div>
  );
};

// Password Strength Checklist Component
const PasswordStrengthChecklist = ({ password }) => {
  const strength = {
    length: password.length >= 8,
    number: /\d/.test(password),
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  return (
    <div className="mt-3 text-sm">
      <p className={strength.length ? 'text-green-500' : 'text-red-500'}>
        {strength.length ? '✔' : '✘'} At least 8 characters
      </p>
      <p className={strength.number ? 'text-green-500' : 'text-red-500'}>
        {strength.number ? '✔' : '✘'} Includes number
      </p>
      <p className={strength.lowercase ? 'text-green-500' : 'text-red-500'}>
        {strength.lowercase ? '✔' : '✘'} Includes lowercase letter
      </p>
      <p className={strength.uppercase ? 'text-green-500' : 'text-red-500'}>
        {strength.uppercase ? '✔' : '✘'} Includes uppercase letter
      </p>
      <p className={strength.special ? 'text-green-500' : 'text-red-500'}>
        {strength.special ? '✔' : '✘'} Includes special symbol
      </p>
    </div>
  );
};


export default function Register() {
  const router = useRouter();
  const { componentLevelLoader, setComponentLevelLoader } = useContext(GlobalContext);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    aboutCompany: '',
    aboutMe: '',
    portfolioURL: '',
    resume: '',
    password: '',
    userType : "employee"
  });
  const handleUserTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      userType: type, // Update userType in formData
    }));
  };
  const uploadToCloudinary = async (file) => {
  
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      toast.error("Cloudinary cloud name is not defined in environment variables.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "....."); // Replace with your upload preset
    formData.append("cloud_name", `${cloudName}`);

    try {
      const response = await fetch(
       `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Calculate password strength
  const passwordStrength = Math.min(
    (password.length >= 8 ? 20 : 0) +
    (/\d/.test(password) ? 20 : 0) +
    (/[a-z]/.test(password) ? 20 : 0) +
    (/[A-Z]/.test(password) ? 20 : 0) +
    (/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 20 : 0),
    100
  );
  const isValidForm = () => {
    // Common fields for all user types
    if (formData.fullName.trim() === "" || formData.email.trim() === "" || formData.password.trim() === "") {
      return false;
    }

    // Conditional fields based on userType
    if (formData.userType === "recruiter") {
      // Validate company-specific fields
      if (formData.companyName.trim() === "" || formData.aboutCompany.trim() === "") {
        return false;
      }
    } else if (formData.userType === "employee") {
      // Validate employee-specific fields
      if (formData.aboutMe.trim() === "" || formData.portfolioURL.trim() === "" || formData.resume === null) {
        return false;
      }
    }

    return true; // All validations passed
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setComponentLevelLoader({ loading: true, id: '' });
  
    try {
      // Conditional logic based on userType
      if (formData.userType === 'employee' && formData.resume) {
        // Upload the file to Cloudinary
        const fileUrl = await uploadToCloudinary(formData.resume);
  
        // Update formData with the uploaded URL
        setFormData((prevState) => ({
          ...prevState,
          resume: fileUrl, // Store the Cloudinary URL instead of the file
        }));
      } else if (formData.userType === 'recruiter') {
        // Directly submit the form for recruiter
        const response = await registerNewUser(formData);
  
        if (response.success) {
          toast.success('Registration successful!');
             setComponentLevelLoader({ loading: false, id: '' });
          router.push('/auth/login'); // Navigate to the login page
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error('Error uploading file or submitting form. Please try again.');
      console.error(error);
      setComponentLevelLoader({ loading: false, id: '' });
    }
  };
  
  useEffect(() => {
    // Proceed with form submission after resume is updated (for employee)
    if (
      formData.userType === 'employee' &&
      typeof formData.resume === 'string' &&
      formData.resume.startsWith("https://res")
    ) {
      const submitForm = async () => {
        try {
          const response = await registerNewUser(formData);
  
          if (response.success) {
            toast.success('Registration successful!');
            router.push('/auth/login'); // Navigate to the login page
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error('Registration failed. Please try again.');
          console.error(error);
        } finally {
          setComponentLevelLoader({ loading: false, id: '' });
        }
      };
  
      submitForm();
    }
  }, [formData.resume, formData.userType]);
  
  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row justify-between">

        {/* Welcome Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 text-center">
          <img src={"/business.png"} alt="Welcome Image" className="mb-4 w-3/4 h-auto rounded-lg shadow-md" />
          <h1 className="text-4xl playfair_display font-bold mb-4 text-gray-800 playfair_display">
            Welcome!
          </h1>
          <p className="text-lg playfair_display text-gray-600 mb-6">
            Create an account 
          </p>
        </div>

        {/* Sign Up Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 playfair_display">
            Create an Account
          </h2>
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="mb-4">
              <label className="block text-left text-gray-700 mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-gray-700 mb-2" htmlFor="phone">
                Phone
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                type="tel"
                name="phone"
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-left text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleChange(e); // Update password in formData as well
                }}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <PasswordStrengthBar strength={passwordStrength} />
            <PasswordStrengthChecklist password={password} />

            {/* User Type Selection */}
            <div className="my-4">
              <label className="block text-gray-700 mb-2">Register as:</label>
              <div className="flex">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="employee"
                    checked={formData.userType === 'employee'}
                    onChange={() => handleUserTypeChange('employee')}
                    className="mr-2"
                  />
                  Employee
                </label>
                <label>
                  <input
                    type="radio"
                    value="recruiter"
                    checked={formData.userType === 'recruiter'}
                    onChange={() => handleUserTypeChange('recruiter')}
                    className="mr-2"
                  />
                  Recruiter
                </label>
              </div>
            </div>

            {/* Conditional Fields for Recruiter */}
            {formData.userType === 'recruiter' && (
              <>
                <div className="mb-4">
                  <label className="block text-left text-gray-700 mb-2" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                    type="text"
                    name="companyName"
                    id="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left text-gray-700 mb-2" htmlFor="companyWebsite">
                    Company Website
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                    type="url"
                    name="companyWebsite"
                    id="companyWebsite"
                    placeholder="Enter your company website"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left text-gray-700 mb-2" htmlFor="aboutCompany">
                    About Company
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                    name="aboutCompany"
                    id="aboutCompany"
                    placeholder="Tell us about your company"
                    value={formData.aboutCompany}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </>
            )}

            {/* Conditional Fields for employee */}
            {formData.userType === 'employee' && (
              <>
                <div className="mb-4">
                  <label className="block text-left text-gray-700 mb-2" htmlFor="aboutMe">
                    About Me
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                    name="aboutMe"
                    id="aboutMe"
                    placeholder="Tell us about yourself"
                    value={formData.aboutMe}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-left text-gray-700 mb-2" htmlFor="portfolioURL">
                    Portfolio URL
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                    type="url"
                    name="portfolioURL"
                    id="portfolioURL"
                    placeholder="Enter your portfolio URL"
                    value={formData.portfolioURL}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left text-gray-700 mb-2" htmlFor="resume">
                    Resume
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm"
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 
                ${componentLevelLoader.loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"}
                 ${!isValidForm() || componentLevelLoader.loading ? "opacity-50 cursor-not-allowed" : ""}`}
             
            >
              {componentLevelLoader.loading ? (
                <ComponentLevelLoader
                  text={"Registering..."}
                  color={"#ffffff"}
                  loading={componentLevelLoader.loading}
                />
              ) : (
                "Register"
              )}
            </button>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-500 hover:underline">
                  Login here
                </Link>.
              </p>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
