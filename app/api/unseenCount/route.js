import { NextResponse } from "next/server";
import connectToDB from "@/database/index";
import Conversation from "@/models/conversation";
import {User} from "@/models/user"
export const dynamic = "force-dynamic"; // without this req.url will not work 

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Fetch all conversations where the user is a participant and populate user details
    const conversations = await Conversation.find({
      participants: userId,
    }).lean();

    // Find the userType of the requesting user
    const user = await User.findById(userId).select("userType avatar").lean();

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found.",
      });
    }

    const { userType, avatar } = user;


    // Calculate total unseen messages for the user across all conversations
    let totalUnseenMessages = 0;

    conversations.forEach((conversation) => {
      const unseenMessages = conversation.unseenMessages[userId] || [];
      totalUnseenMessages += unseenMessages.length;
    });

    return NextResponse.json({
      success: true,
      unseenMessageCount: totalUnseenMessages,
      userType, // Include the userType of the requesting user
      avatar,
    });
  } catch (error) {
    console.error("Error in fetching unseen messages:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
