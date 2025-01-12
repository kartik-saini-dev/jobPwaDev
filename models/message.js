import mongoose from "mongoose";

import User from "./user";
const messageSchema = new mongoose.Schema({
  to: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["Text", "Media", "Document", "System", "Link", "File"],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  text: {
    type: String,
  },
  file: {
    type: String,
  },
  seenByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

});

const Message =  mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
