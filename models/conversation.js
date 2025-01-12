

import mongoose from "mongoose";
import Message from "./message";
import User from "./user";
const conversationSchema = new mongoose.Schema({
  groupName: {
    type: String,
    unique: false,
    required: false,
  },
  groupPic:{
    type: String,
    required: false,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: false,
    required: false,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Message'
    }
  ],
  unseenMessages: {
    type: Map,
    of: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    default: new Map(),
  },
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

export default Conversation;
