
import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";



export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json(); // Parse the JSON body
    const { groupName, applicants, admin, conversationId, groupPic } = body;

    if (!applicants || applicants.length < 1) {
      return NextResponse.json({
        success: false,
        message: "At least one participant is required to create a conversation.",
      });
    }

    const participants = Array.isArray(applicants) ? applicants : applicants.split(",");

    let conversation;

    if (conversationId) {
      // Check if the conversation already exists by ID
      conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return NextResponse.json({
          success: false,
          message: "Conversation not found.",
        });
      }

      // Check if the user is the group admin
      if (conversation.admin.toString() !== admin) {
        return NextResponse.json({
          success: false,
          message: "Only the group admin can modify this group.",
        });
      }

      // Update the group name and add participants if needed
      if (conversation.groupName !== groupName) {
        conversation.groupName = groupName; // Update the group name
      }

      // Add new participants to the group
      const newParticipants = participants.filter(
        (participant) => !conversation.participants.includes(participant)
      );
      conversation.participants.push(...newParticipants);

      await conversation.save();

      return NextResponse.json({
        success: true,
        message: "Group conversation updated successfully.",
        convId: conversation._id,
      });
    } else {
      // Check if the conversation already exists with the given participants
      conversation = await Conversation.findOne({ participants });

      if (conversation) {
        return NextResponse.json({
          success: true,
          message: "Conversation already exists.",
          convId: conversation._id,
        });
      }

      // Create a new group conversation
      conversation = await Conversation.create({
        groupName,
        participants,
        admin,
        groupPic,
      });

      return NextResponse.json({
        success: true,
        message: "New group conversation created successfully.",
        convId: conversation._id,
      });
    }
  } catch (error) {
    console.error("Error creating or updating conversation:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
