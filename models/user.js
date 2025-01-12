import mongoose from "mongoose";
import crypto from "crypto";
import Job from "@/models/job"


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Reference to the Job model
    },
  ],
  followers: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
        },
      },
    ],
    default: [], // Default to an empty array if no followers
  },
  following: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
        },
      },
    ],
    default: [], // Default to an empty array if no followers
  },
  credits: {
    type: Number,
    default: 0, // Initial credit is 0
    min: 0, // Prevent negative credits
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: false,
    minlength: 8,
  },
  lastSeen :{
    type:Date,
    required: false,
    default: Date.now(),
},
online :{
  type:Boolean,
  default: false,
},
  userType: {
    type: String,
    enum: ['employee', 'recruiter','user'],
    default: 'user',
  },
  companyName: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return this.userType === 'recruiter' ? v.length > 0 : true;
      },
      message: "Company Name is required for recruiters.",
    },
  },
  companyWebsite: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return this.userType === 'recruiter' ? v.length > 0 : true;
      },
      message: "Company Website is required for recruiters.",
    },
  },
  aboutCompany: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return this.userType === 'recruiter' ? v.length > 0 : true;
      },
      message: "About Company is required for recruiters.",
    },
  },
  aboutMe: {
    type: String,
    trim: true,
  },
  resume: {
    type: String,
    validate: {
      validator: function (v) {
        return this.userType === 'employee' ? v.length > 0 : true;
      },
      message: "Resume is required for employees.",
    },
  },
  avatar: {
    type: String,
    required: false,
  },
  portfolioURL: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return this.userType === 'employee' ? v.length > 0 : true;
      },
      message: "Portfolio URL is required for employees.",
    },
  },
  githubURL: {
    type: String,
    validate: {
      validator: function (v) {
        return this.userType === 'employee' ? v.length > 0 : true;
      },
      message: "GitHub URL is required for employees.",
    },
  },
  
  description:{
    type: String,
    unique: false,
    required:false,
  },
 
  instagramURL: {
    type: String,
  },
  twitterURL: {
    type: String,
  },
  linkedInURL: {
    type: String,
  },
  facebookURL: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
},{
  timestamps: true
});

// this is how to define methods in model in order to use in application check out forgot password
// Generating Reset Password Token
userSchema.methods.getResetPasswordToken = function () {  
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and Adding Reset Password Token To UserSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Setting Reset Password Token Expiry Time
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
