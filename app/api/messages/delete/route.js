import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import mongoose from "mongoose";
import Message from "../../../../models/message";

export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get("sender");
    const messageId = searchParams.get("messageId");
    const conversationId = searchParams.get("conversationId");
    const isGroup = searchParams.get("isGroup") === "true"; // Explicit boolean conversion
    const objectIdMessageId = new mongoose.Types.ObjectId(messageId);

    if (!messageId || !conversationId || !senderId) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find the conversation by ID
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Ensure the message belongs to the conversation
    if (!conversation.messages.includes(objectIdMessageId)) {
      return NextResponse.json({
        success: false,
        message: "Message not found in conversation",
      });
    }

    // Remove the message from the conversation's messages array
    const result = await Conversation.updateOne(
      { _id: conversation._id },
      { $pull: { messages: objectIdMessageId } }
    );

    if (result.modifiedCount > 0) {
      // Delete the message from the Message collection
      await Message.deleteOne({ _id: objectIdMessageId });

      // Handle unseenMessages logic
      const unseenMessages = conversation.unseenMessages || new Map();

      if (isGroup) {
        // For group chats, update unseenMessages for all participants
        for (const userId of conversation.participants) {
          const userIdStr = userId.toString();
          if (unseenMessages.has(userIdStr)) {
            const unseenArray = unseenMessages.get(userIdStr) || [];
            unseenMessages.set(
              userIdStr,
              unseenArray.filter((id) => id.toString() !== messageId)
            );
          }
        }
      } else {
        // For one-on-one chats, update unseen messages for both sender and the other participant
        const otherParticipant = conversation.participants.find(
          (userId) => userId.toString() !== senderId
        );

        [senderId, otherParticipant].forEach((userId) => {
          const userIdStr = userId.toString();
          if (unseenMessages.has(userIdStr)) {
            const unseenArray = unseenMessages.get(userIdStr) || [];
            unseenMessages.set(
              userIdStr,
              unseenArray.filter((id) => id.toString() !== messageId)
            );
          }
        });
      }
            
      // Save the updated unseenMessages
      conversation.unseenMessages = unseenMessages;
      await conversation.save();

      // Calculate unseen messages count for all conversations involving the participants
      const allConversations = await Conversation.find({
        participants: { $in: conversation.participants },
      });

      const totalUnseenCount = {};
      allConversations.forEach((conv) => {
        conv.participants.forEach((userId) => {
          if (userId.toString() !== senderId) {
            const convUnseenMessages = conv.unseenMessages.get(userId.toString()) || [];
            totalUnseenCount[userId.toString()] =
              (totalUnseenCount[userId.toString()] || 0) + convUnseenMessages.length;
          }
        });
      });
 
      return NextResponse.json({
        success: true,
        message: "Message deleted successfully",
        totalUnseenCount,
      });
    }

    return NextResponse.json({
      success: false,
      message: "Message deletion failed",
    });
  } catch (error) {
    console.error("Error in deleting message:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}