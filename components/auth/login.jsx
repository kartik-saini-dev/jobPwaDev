"use client"; // Ensure this runs on the client-side
import React, { useState, useEffect, useContext } from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Toaster, toast } from "sonner"; // Ensure you've installed this package
import Link from 'next/link';
import axios from "axios";
import { GlobalContext } from "@/context"; // Import your context
import { login } from "@/services/login"; // Import your existing login function
import ComponentLevelLoader from "@/components/Loader/componentlevel"; // Loader component
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function SignInPage() {
  const { setPageLevelLoader, isAuthUser, setIsAuthUser, setUser, componentLevelLoader, setComponentLevelLoader } = useContext(GlobalContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // New state to toggle forgot password
  const [hidePassword, setHidePassword] = useState(false); // New state to hide password
  const router = useRouter();  

  // Google login handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }).then((res) => res.json());

        const { given_name, family_name, email, picture } = userInfo;


        const userData = {
          fullName: `${given_name} ${family_name}`,
          email,
          avatar: picture,
          userType: "user",
        };

        // Replace the URL with your backend API endpoint for Google login
        const googleResponse = await axios.post('/api/google-signup', userData);

        // Handle Google login response
        if (googleResponse.data.success) {
          toast.success(googleResponse.data.message);
          Cookies.set('my-cookie', googleResponse.data.token);
          setIsAuthUser(true);
          setUser(googleResponse.data.user);
          localStorage.setItem("user", JSON.stringify(response.user));
          router.push("/"); // Redirect to home after successful login
          router.refresh();
        } else if ( googleResponse.data.message === "Email Address already exists. Try Login.") {

          toast.error(googleResponse.data.message);
          setEmail(email);
          setHidePassword(true); // Hide the password field
          
        } else {
          toast.error(googleResponse.data.message);
        }
      } catch (error) {
        toast.error("Google login failed");
        console.error(error);
      }
    },
    onFailure: () => {
      toast.error("Google login failed");
    },
  });

  const isValidForm = () => {
    return email.trim() !== "" && (!isForgotPassword && !hidePassword ? password.trim() !== "" : true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loader to indicate processing
    setComponentLevelLoader({ loading: true, id: "" });
  
    try {
      if (isForgotPassword) {
        // Handle forgot password API call
        const response = await axios.post('/api/auth/forgotPassword', { email });
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Handle login
        const userData = { email, password };
        const response = await login(userData); // Use your existing login function
  
        if (response.success) {
          toast.success(response.message);
          Cookies.set('my-cookie', response.token); // Store token in cookies
          setIsAuthUser(true);
          setUser(response.user); // Update user context or state
          localStorage.setItem("user", JSON.stringify(response.user)); // Persist user data in local storage
          router.push("/"); // Navigate to the home page
          router.refresh();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      // General error handling
      if (isForgotPassword) {
        toast.error("Failed to send reset link. Try again later.");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
      console.error(error);
    } finally {
      // Always reset loader
      setComponentLevelLoader({ loading: false, id: "" });
    }
  };

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row justify-between">

        {/* Welcome Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 text-center">
          <img src={"/real-estate-property.jpg"} alt="Welcome Image" className="mb-4 w-3/4 h-auto rounded-lg shadow-md" />
          <h1 className="text-4xl font-bold playfair_display mb-4 text-gray-800">Welcome!</h1>
          <p className="text-lg text-gray-600 playfair_display mb-6">
            Create an account to Work into your dream company.
          </p>
        </div>

        {/* Sign In/Forgot Password Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold playfair_display mb-4 text-gray-800">
            {isForgotPassword ? "Forgot Password" : "Sign In"}
          </h2>

          {/* Google Login Button */}
          {!isForgotPassword && (
            <>
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full bg-white text-black border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
              >
                <FcGoogle className="mr-2" />
                Sign in with Google
              </button>

              <div className="my-4 w-full text-center">
                <p className="text-gray-500">or</p>
              </div>
            </>
          )}

          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-left text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Conditionally hide the password input based on state */}
            {!hidePassword && !isForgotPassword && (
              <div className="mb-4 relative">
                <label className="block text-left text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            )}

            <button
              type="submit"
              className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 
              ${componentLevelLoader.loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"}
              ${!isValidForm() || componentLevelLoader.loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {componentLevelLoader.loading ? (
                <ComponentLevelLoader
                  text={isForgotPassword ? "Sending Reset Link" : "Logging In"}
                  color={"#ffffff"}
                  loading={componentLevelLoader.loading}
                />
              ) : (
                isForgotPassword ? "Send Reset Link" : "Sign In"
              )}
            </button>

            {!isForgotPassword && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-blue-500 hover:underline">
                    Sign Up here
                  </Link>.
                </p>
                <button
                  type="button"
                  className="mt-4 text-sm text-blue-500 hover:underline"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {isForgotPassword && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <Toaster position="bottom-center" richColors />
    </div>
  );
}
