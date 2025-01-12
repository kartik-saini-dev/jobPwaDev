// This part of the model is not currently used in this application. 
// Keeping it here for learning purposes.
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const normalUser = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Required!"],
  },
  email: {
    type: String,
    required: [true, "Email Required!"],
    unique: true, // Ensuring unique emails for recruiters
  },
  
  image: { type: String },
  password: { type: String, select: true },

});

// Hash the password before saving
recruiterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare passwords
recruiterSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
recruiterSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};


export const Recruiter = mongoose.model("normalUser", normalUser);
