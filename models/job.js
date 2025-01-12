import mongoose from "mongoose";
import { User } from "@/models/user";
import Application from "@/models/application";


// Job schema definition
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String], // Array to store multiple requirements
    },
    responsibilities: {
      type: [String], // Array to store multiple responsibilities
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String, // Type of job (e.g., Full-time, Part-time)
      required: true,
    },
    industry: {
      type: String, // Industry of the job (e.g., IT, Finance)
    },
    companyName: {
      type: String, // Company name offering the job
      required: true,
    },
    skillsRequired: {
      type: [String], // Array of skills required
    },
    benefits: {
      type: [String], // Array of job benefits
    },
    images: {
      type: [String], // Array of image URLs
    },
    deadline: {
      type: Date, // Job application deadline
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Recruiter model
      required: true,
    },
    views: [String], // Array to store user IDs of viewers
    viewCount: {
      type: Number,
      default: 0, // Initial view count
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application", // Reference to the Application model
      },
    ],
  },
  { timestamps: true }
);

// Create the Job model
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
