"use client";

import React, { useState, useContext, Suspense } from "react";
import { Toaster, toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { GlobalContext } from "@/context";
import ComponentLevelLoader from "@/components/Loader/componentlevel";

const PasswordStrengthBar = ({ strength }) => {
  const getColor = () => {
    if (strength === 100) return "bg-green-500";
    if (strength >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full h-2 mt-3 bg-gray-300 rounded-lg overflow-hidden">
      <div
        className={`h-full ${getColor()} transition-all duration-300`}
        style={{ width: `${strength}%` }}
      ></div>
    </div>
  );
};

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
      <p className={strength.length ? "text-green-500" : "text-red-500"}>
        {strength.length ? "✔" : "✘"} At least 8 characters
      </p>
      <p className={strength.number ? "text-green-500" : "text-red-500"}>
        {strength.number ? "✔" : "✘"} Includes number
      </p>
      <p className={strength.lowercase ? "text-green-500" : "text-red-500"}>
        {strength.lowercase ? "✔" : "✘"} Includes lowercase letter
      </p>
      <p className={strength.uppercase ? "text-green-500" : "text-red-500"}>
        {strength.uppercase ? "✔" : "✘"} Includes uppercase letter
      </p>
      <p className={strength.special ? "text-green-500" : "text-red-500"}>
        {strength.special ? "✔" : "✘"} Includes special symbol
      </p>
    </div>
  );
};

function ResetPasswordComponent() {
  const { setComponentLevelLoader, componentLevelLoader } = useContext(GlobalContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const passwordStrength = Math.min(
    (password.length >= 8 ? 20 : 0) +
      (/\d/.test(password) ? 20 : 0) +
      (/[a-z]/.test(password) ? 20 : 0) +
      (/[A-Z]/.test(password) ? 20 : 0) +
      (/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 20 : 0),
    100
  );

  const isValidForm = () => {
    return password.trim() !== "" && password === confirmPassword;
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!isValidForm()) {
      toast.error("Passwords do not match or are empty.");
      return;
    }

    setComponentLevelLoader({ loading: true, id: "" });

    try {
      const resetToken = searchParams.get("token");

      const response = await axios.post("/api/auth/resetPassword", {
        password,
        token: resetToken,
      });

      if (response.data.success) {
        toast.success("Password has been successfully reset!");
        router.push("/auth/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      console.error(error);
    } finally {
      setComponentLevelLoader({ loading: false, id: "" });
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create New Password
        </h2>

        <form onSubmit={handlePasswordReset}>
          <div className="mb-4 relative">
            <label
              className="block text-left text-gray-700 mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <PasswordStrengthBar strength={passwordStrength} />
          <PasswordStrengthChecklist password={password} />
          <div className="mb-6 relative">
            <label
              className="block text-left text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${
              componentLevelLoader.loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
            } ${!isValidForm() || componentLevelLoader.loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={"Resetting Password"}
                color={"#ffffff"}
                loading={componentLevelLoader.loading}
              />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <Toaster richColors />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}
