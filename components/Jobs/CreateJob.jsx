"use client"
import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { createJob } from "@/services/createjob";
import JobFormInput from "@/components/formElements/JobFormInput";
import RequirementField from "@/components/formElements/RequirementField";
import ResponsibilityField from "@/components/formElements/ResponsibilityField"
import ImageUploader from "@/components/formElements/ImageUploader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

const initialFormData = {
  title: "",
  category: "",
  description: "",
  requirements: [],
  responsibilities: [],
  salary: 0,
  experience: 0,
  jobType: "",
  industry: "",
  companyName: "",
  skillsRequired: [],
  benefits: [],
  deadline: "",
  recruiterId: "",
  images: [],
};

const CreateJob = () => {
  const { setPageLevelLoader, user, setComponentLevelLoader } = useContext(GlobalContext);
  const router = useRouter();
  const [jobData, setJobData] = useState(initialFormData);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

 
   useEffect(()=>{
      setPageLevelLoader(false);
   },[]);
  const handleAddSkill = () => {
    setJobData((prev) => ({
      ...prev,
      skillsRequired: [...prev.skillsRequired, ""],
    }));
  };

  const handleRemoveSkill = (index) => {
    setJobData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((_, i) => i !== index),
    }));
  };

  const handleChangeSkill = (index, value) => {
    setJobData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.map((skill, i) =>
        i === index ? value : skill
      ),
    }));
  };

  const handleAddBenefit = () => {
    setJobData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  const handleRemoveBenefit = (index) => {
    setJobData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleChangeBenefit = (index, value) => {
    setJobData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) =>
        i === index ? value : benefit
      ),
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

  const removeFromCloudinary = async (publicId) => {
    try {
      const response = await fetch("/api/cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileURL: publicId }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete file from Cloudinary");
      }
    } catch (error) {
      console.error("Error removing file from Cloudinary:", error);
    }
  };

  const handleDeleteImage = async (url) => {
    await removeFromCloudinary(url);
    setFiles((prev) => prev.filter((file) => file !== url));
  };
  const sanitizeFormData = (data) => {
    return {
      ...data,
      title: DOMPurify.sanitize(data.title),
      category: DOMPurify.sanitize(data.category),
      description: DOMPurify.sanitize(data.description), // Sanitize rich text editor content
      requirements: data.requirements.map((req) => DOMPurify.sanitize(req)),
      responsibilities: data.responsibilities.map((res) => DOMPurify.sanitize(res)),
      jobType: DOMPurify.sanitize(data.jobType),
      industry: DOMPurify.sanitize(data.industry),
      companyName: DOMPurify.sanitize(data.companyName),
      skillsRequired: data.skillsRequired.map((skill) => DOMPurify.sanitize(skill)),
      benefits: data.benefits.map((benefit) => DOMPurify.sanitize(benefit)),
      deadline: DOMPurify.sanitize(data.deadline),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setComponentLevelLoader({ loading: true, id: "" });

    try {
      // Sanitize job data before submission
      const sanitizedJobData = sanitizeFormData({
        ...jobData,
        recruiterId: user?._id || "",
        images: files,
      });

      const response = await createJob(sanitizedJobData);
     
      if (response.success) {
        toast.success("Job created successfully!");
        setJobData(initialFormData);
        setFiles([]);
        router.push("/");
      } else {
        toast.error("Failed to create job. Please try again.");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("An error occurred.");
    } finally {
      setComponentLevelLoader({ loading: false, id: "" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-5 text-gray-900">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <JobFormInput id="title" name="title" label="Job Title" type="text" value={jobData.title} onChange={(e) => setJobData((prev) => ({ ...prev, title: e.target.value }))} required />
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={jobData.category}
            onChange={(e) =>
              setJobData((prev) => ({ ...prev, category: e.target.value }))
            }
            required
          >
            <option value="">Select a Category</option>
            <option value="Technology">Technology</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="HR">Human Resources</option>
            <option value="Sales">Sales</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
        <ReactQuill value={jobData.description} onChange={(value) => setJobData((prev) => ({ ...prev, description: value }))} />
        </div>
   
        <div className="mb-4">
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            id="jobType"
            name="jobType"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={jobData.jobType}
            onChange={(e) =>
              setJobData((prev) => ({ ...prev, jobType: e.target.value }))
            }
            required
          >
            <option value="">Select Job Type</option>
            <option value="Remote">Remote</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
        <JobFormInput id="industry" name="industry" label="Industry" type="text" value={jobData.industry} onChange={(e) => setJobData((prev) => ({ ...prev, industry: e.target.value }))} />
        <JobFormInput id="companyName" name="companyName" label="Company Name" type="text" value={jobData.companyName} onChange={(e) => setJobData((prev) => ({ ...prev, companyName: e.target.value }))} />
        <JobFormInput
          id="salary"
          name="salary"
          label="Salary"
          type="number"
          value={jobData.salary}
          onChange={(e) => setJobData((prev) => ({ ...prev, salary: e.target.value }))}
          required
        />

        {/* Experience */}
        <JobFormInput
          id="experience"
          name="experience"
          label="Experience (in years)"
          type="number"
          value={jobData.experience}
          onChange={(e) => setJobData((prev) => ({ ...prev, experience: e.target.value }))}
          required
        />
          <JobFormInput
          id="deadline"
          name="deadline"
          label="Deadline"
          type="date"
          value={jobData.deadline}
          onChange={(e) => setJobData((prev) => ({ ...prev, deadline: e.target.value }))}
        />
       
        {/* Skills Required */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Skills Required</label>
          {jobData.skillsRequired.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={skill}
                onChange={(e) => handleChangeSkill(index, e.target.value)}
                placeholder="Enter a skill"
              />
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveSkill(index)}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700"
            onClick={handleAddSkill}
          >
            + Add Skill
          </button>
        </div>

        {/* Job Benefits */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Job Benefits</label>
          {jobData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={benefit}
                onChange={(e) => handleChangeBenefit(index, e.target.value)}
                placeholder="Enter a benefit"
              />
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveBenefit(index)}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700"
            onClick={handleAddBenefit}
          >
            + Add Benefit
          </button>
        </div>
        <RequirementField
          requirements={jobData.requirements}
          onAdd={() => setJobData((prev) => ({ ...prev, requirements: [...prev.requirements, ""] }))}
          onRemove={(index) => setJobData((prev) => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }))}
          onChange={(index, value) => setJobData((prev) => ({ ...prev, requirements: prev.requirements.map((req, i) => (i === index ? value : req)) }))}
        />
        <ResponsibilityField
          responsibilities={jobData.responsibilities}
          onAdd={() => setJobData((prev) => ({ ...prev, responsibilities: [...prev.responsibilities, ""] }))}
          onRemove={(index) => setJobData((prev) => ({ ...prev, responsibilities: prev.responsibilities.filter((_, i) => i !== index) }))}
          onChange={(index, value) => setJobData((prev) => ({ ...prev, responsibilities: prev.responsibilities.map((resp, i) => (i === index ? value : resp)) }))}
        />
        <ImageUploader files={files} setFiles={setFiles} onUpload={uploadToCloudinary} onDelete={handleDeleteImage} />
        <button type="submit" className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400" disabled={loading}>
          {loading ? "Submitting..." : "Create Job"}
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default CreateJob;
