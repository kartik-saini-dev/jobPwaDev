import mongoose from "mongoose";

// Define the Application schema
const messageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: false 
  }, 
  email: {
    type: String,
    required: true,
    unique: true, // Enforce uniqueness for email
    trim: true,
    lowercase: true,
  },
  messages: { 
    type: [String], // Array of strings to store multiple messages
    required: false,
  },
});

const ContactUs = mongoose.models.ContactUs || mongoose.model("ContactUs", messageSchema);

export default ContactUs;
