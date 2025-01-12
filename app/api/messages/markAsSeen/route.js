

import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import Message from "../../../../models/message";
import { User } from "@/models/user";

export async function PUT(req) {
  try {
    await connectToDB();

    const { conversationId, userId } = await req.json();

    if (!conversationId || !userId) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find the conversation
    const conversation = await Conversation.findById(conversationId).populate("messages");

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      });
    }

    let unseenMessCount;
    // Get unseen message IDs for the specific user
    const unseenMessageIds = conversation.unseenMessages.get(userId) || [];

    if (unseenMessageIds.length === 0) {
      // Calculate remaining unseen messages count for the conversation
      unseenMessCount = 0

    } else {
      unseenMessCount = Array.from(conversation.unseenMessages.values()).reduce(
        (total, userMessages) => total + userMessages.length,
        0
      );
    }

    // Update the unseen messages as seen by the specific user
    const updatedMessages = [];
    const seenByUsersDetails = [];
    for (const messageId of unseenMessageIds) {
      const message = await Message.findById(messageId);

      if (message) {
        // Deduplicate seenByUsers before adding userId
        const uniqueSeenByUsers = new Set(message.seenByUsers.map((id) => id.toString()));
        uniqueSeenByUsers.add(userId.toString()); // Add the userId only once
        message.seenByUsers = Array.from(uniqueSeenByUsers); // Convert back to an array

        await message.save();

        updatedMessages.push({
          _id: message._id,
          seenByUsers: message.seenByUsers,
        });

        // Populate seenByUsers details for each message
        const seenByUsersData = await Promise.all(
          message.seenByUsers.map(async (seenUserId) => {
            const user = await User.findById(seenUserId); // Assuming a User model exists
            return {
              _id: seenUserId,
              fullName: user.fullName, // Populate fullName
              avatar: user.avatar,    // Populate avatar
            };
          })
        );
        seenByUsersDetails.push(...seenByUsersData);
      }
    }
    // Clear unseen messages for the user
    conversation.unseenMessages.set(userId, []);

    // Save the updated conversation
    await conversation.save();



    return NextResponse.json({
      success: true,
      message: "Messages marked as seen successfully",
      unseenMessCount,
      unseenMessageIds,
      seenByUsers: seenByUsersDetails, // Include user details for seen messages
    });
  } catch (error) {
    console.error("Error in marking messages as seen:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
