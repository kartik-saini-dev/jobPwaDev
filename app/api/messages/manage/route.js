import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import Message from "../../../../models/message";

export async function POST(req) {
  try {
    const { action, conversationId, userId } = await req.json();

    await connectToDB();

    if (action === "delete") {
      // Find the conversation
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return NextResponse.json({ success: false, message: "Conversation not found" });
      }

      // Delete all messages in the `messages` array
      await Message.deleteMany({ _id: { $in: conversation.messages } });

      // Delete the conversation itself
      await Conversation.findByIdAndDelete(conversationId);

      return NextResponse.json({ success: true, message: "Conversation and messages deleted" });
    } else if (action === "leave") {
      // Remove the user from the participants list in the conversation
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $pull: { participants: userId } },
        { new: true }
      );
      return NextResponse.json({ success: true, message: "Left the group"});
    }else if (action === "deleteConversation"){
    
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return NextResponse.json({ success: false, message: "Conversation not found" });
      }

      // Delete all messages in the `messages` array
      await Message.deleteMany({ _id: { $in: conversation.messages } });
      conversation.messages = [];
      await conversation.save();
      return NextResponse.json({ success: true, message: "All messages has been deleted" });

    }

    return NextResponse.json({ success: false, message: "Invalid action" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
