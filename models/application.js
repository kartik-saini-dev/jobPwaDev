import mongoose from "mongoose";
import {User} from "@/models/user";
import Job from "@/models/job";

// Define the Application schema
const applicationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the worker (user) who applied
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  }, // Reference to the Job being applied for
  recruiter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the User who posted the Job (recruiter)
  appliedAt: { 
    type: Date, 
    default: Date.now 
  }, // Timestamp of the application
  status: { 
    type: String, 
    enum: ['pending', 'shortlisted', 'hired', 'rejected'], 
    default: 'pending' // Default status of the application
  },
 // Link to the applicant's resume or CV
});

const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default Application;
