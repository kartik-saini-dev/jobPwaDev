import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import Message from "../../../../models/message";



export async function PUT(req) {
  try {
    await connectToDB();

    // Extract query parameters from URL
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get("sender");
    const messageId = searchParams.get("messageId");
    const conversationId = searchParams.get("conversationId");

    // Parse request body
    const { text, isGroup, receiver, groupName } = await req.json();

    // Validate required fields
    if (!messageId || !text || (!isGroup && (!senderId || !receiver))) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find the conversation based on group or individual chat
    const conversationQuery = isGroup
      ? { _id: conversationId, groupName } // Match by group ID and name
      : { _id: conversationId, participants: {  $size: 2 , $all: [senderId, receiver] } }; // Match by participants for individual chats

    const conversation = await Conversation.findOne(conversationQuery);

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Check if the message exists in the conversation
    if (!conversation.messages.includes(messageId)) {
      return NextResponse.json({
        success: false,
        message: "Message not found in conversation",
      });
    }

    // Update the message in the Message collection
    const result = await Message.updateOne(
      { _id: messageId },
      { $set: { text: String(text) } }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        updatedMessage: {
          _id: messageId,
          text,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: "Message could not be updated",
    });
  } catch (error) {
    console.error("Error in updating message:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
