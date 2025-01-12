import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index"; // DB connection function
import Conversation from "../../../../models/conversation";

export const dynamic = "force-dynamic";


const getLastValidMessage = (messages, sender) => {
  // Iterate over messages and find the first valid one
  for (const message of messages) {
    if (
      message.type !== "System" &&
      (message.to.some((userId) => userId.toString() === sender) ||
        message.from.toString() === sender)
    ) {
      return message;
    }
  }
  return null; // Return null if no valid message is found
};


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sender = searchParams.get("sender");

  if (!sender) {
    return NextResponse.json(
      { success: false, message: "Sender ID is required" },
      { status: 400 }
    );
  }

  try {
    // Establish DB connection
    await connectToDB();

    // Fetch conversations where the sender is a participant
const conversations = await Conversation.find({ participants: sender })
  .populate("participants", "fullName avatar") // Populate participant details
  .populate({
    path: "messages",
    options: { sort: { created_at: -1 } }, // Sort by creation date
    perDocumentLimit: 2, // Limit to 2 messages per conversation at DB level
  });

     console.log(conversations,"this is conversations");

    // Prepare response by excluding the sender from participants
    const conversationsWithDetails = conversations.map((conversation) => {
      // Filter out the sender from participants
      const otherParticipants = conversation.participants.filter(
        (participant) => participant._id.toString() !== sender
      );

      // Extract unseen messages count for the sender
      const unseenMessages = conversation.unseenMessages.get(sender) || [];
      const unseenCount = unseenMessages.length;

      // Determine the last valid message
        const lastMessage = getLastValidMessage(conversation.messages, sender); 
      return {
        conversationId: conversation._id,
        groupName: conversation.groupName || null,
        groupPic: conversation.groupPic || null,
        participants: otherParticipants,
        lastMessage,
        unseenCount,
      };
    });

    return NextResponse.json({
      success: true,
      data: conversationsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}