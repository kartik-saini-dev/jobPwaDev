


"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "@/context";
import { toast, Toaster } from "sonner";
import { MdAddAPhoto, MdPerson, MdOutlineEdit } from "react-icons/md";

function Profile() {
  const router = useRouter();

  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    fullName: "",
    description: "",
    img: "",
  });

  const { setPageLevelLoader, user, setAvatar } = useContext(GlobalContext);

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  useEffect(() => {
    if (user) {
      setData({
        fullName: user.fullName || "",
        description: user.description || "",
        img: user.img || "",
      });
    }
  }, [user]);

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
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (file && validImageTypes.includes(file.type)) {
      setImage(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please upload a valid image (jpg, png, gif).");
    }
  };

  const setProfile = async () => {
    if (!user) {
      toast.error("Please login first to update your profile.");
      return;
    }

    const { fullName, description } = data;
    if (!fullName.trim() || !description.trim()) {
      toast.error("Please fill in your full name and description.");
      return;
    }

    setLoading(true);
    let uploadedImageUrl = data.img;

    try {
      if (image) {
        uploadedImageUrl = await uploadToCloudinary(image);
      }

      const response = await axios.put(
        `/api/register/update?userId=${user?._id}`,
        {
          ...data,
          img: uploadedImageUrl,
        }
      );

      if (response.data.success) {
        toast.success("Profile Updated Successfully");
        setAvatar(response.data.avatar);
      } else {
        toast.error("Error updating profile.");// can show message from backend as well
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("An error occurred while saving the profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "block w-full text-sm border border-gray-300 rounded-md bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm";

  const labelClassName = "mb-1 text-sm font-medium text-gray-700";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      {errorMessage && (
        <div className="w-full text-center text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Edit Your Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          <div
            className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-500"
            onMouseEnter={() => setImageHover(true)}
            onMouseLeave={() => setImageHover(false)}
          >
            {data.img || image ? (
              <Image
                src={image ? URL.createObjectURL(image) : data.img}
                alt="Profile"
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <MdPerson className="text-gray-500 w-full h-full" />
            )}

            {imageHover && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <MdAddAPhoto className="text-white text-2xl" />
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFile}
                  accept="image/*"
                />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">Upload Profile Picture</p>
        </div>

        <div className="grid gap-4">

          <div>
            <label className={labelClassName} htmlFor="fullName">
              Full Name
            </label>
            <input
              className={inputClassName}
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter full name"
              value={data.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClassName} htmlFor="description">
              About You
            </label>
            <textarea
              className={inputClassName + " resize-none h-20"}
              name="description"
              id="description"
              placeholder="Tell us about yourself..."
              value={data.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <button
          onClick={!loading ? setProfile : null}
          disabled={loading}
          className={`mt-6 w-full py-2 text-white font-semibold rounded-md transition-all duration-200 shadow-md ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
      <Toaster />
    </div>
  );
}

export default Profile;
