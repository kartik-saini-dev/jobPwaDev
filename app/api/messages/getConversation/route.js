import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";

export const dynamic = "force-dynamic";



export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const convId = searchParams.get("convId");
    const userId = searchParams.get("userId");
            

    if (!convId) {
      return NextResponse.json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    // Fetch the conversation by ID and populate its participants and messages
    const conversation = await Conversation.findById(convId)
    .populate("participants", "_id fullName avatar email lastSeen online createdAt") // Populate participants with selected fields
    .populate("admin","_id avatar fullName email online")
    .populate("messages") // Populate messages first
    .populate({
      path: "messages", // Populate messages first
      match: { 
        $and: [
          { $or: [{ to: userId }, { from: userId }] }, // Only include messages relevant to the user
          { $or: [{ type: { $ne: "System" } }, { from: { $ne: userId } }] } // Exclude system messages sent by the user
        ]
      },
      populate: {
        path: "seenByUsers", // Now populate seenByUsers in each message
        select: "fullName avatar ", // Select the fields you need (fullName, avatar)
      }
    });
  



    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found.",
      });
    }

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
