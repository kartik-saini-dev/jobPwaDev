import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Message from "../../../../models/message";
import Conversation from "../../../../models/conversation";

export async function POST(req) {
  try {
    await connectToDB();

    const {
      to, // recipient ID (for private chats)
      from, // sender ID
      message,
      type,
      createdAt,
      isGroup,
      conversationId,
      seenBy, // List of users who have seen the message
    } = await req.json();

    if (!from || !type || !message || (isGroup && !conversationId)) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create the message document
    const newMessage = await Message.create({
      to,
      from,
      text: message,
      type,
      seenByUsers: seenBy || [from],
      created_at: createdAt || new Date(),
    });

    // Fetch the existing conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Add the message to the conversation
    conversation.messages.push(newMessage._id);

    // Initialize or update unseenMessages
    const unseenMessages = conversation.unseenMessages || new Map();

    conversation.participants.forEach((userId) => {
      if (!seenBy.includes(userId.toString())) {
        const userMessages = unseenMessages.get(userId.toString()) || [];
        unseenMessages.set(userId.toString(), [...userMessages, newMessage._id]);
      }
    });

    // Update the unseenMessages in the conversation
    conversation.unseenMessages = unseenMessages;

    // Save the updated conversation
    await conversation.save();

    // Calculate the total unseen messages for all users except the sender
    const allConversations = await Conversation.find({
      participants: { $in: conversation.participants },
    });

    const totalUnseenCount = {};
    allConversations.forEach((conv) => {
      conv.participants.forEach((userId) => {
        if (userId.toString() !== from.toString()) {
          const convUnseenMessages = conv.unseenMessages.get(userId.toString()) || [];
          totalUnseenCount[userId.toString()] = (totalUnseenCount[userId.toString()] || 0) + convUnseenMessages.length;
        }
      });
    });

    // Fetch the created message with populated seenByUsers
    const populatedMessage = await Message.findById(newMessage._id).populate({
      path: "seenByUsers",
      select: "fullName avatar", // Select the fields you need
    });

    // Return the response
    return NextResponse.json({
      success: true,
      message: populatedMessage,
      unseenMessageCounts: Object.fromEntries(unseenMessages), // Convert Map to a plain object for JSON response
      totalUnseenCount,
    });
  } catch (error) {
    console.error("Error in sending message:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
