import connectToDb from '@/database'; // Ensure correct import path
import ContactUs from '@/models/contactUs'; // Ensure correct import path
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Parse the incoming request body
  const { name, email, message } = await req.json();

  // Ensure DB connection
  await connectToDb();

  // Validate required fields
  if (!email || !message) {
    return NextResponse.json(
      { error: "Email and message are required." },
      { status: 400 }
    );
  }

  try {
    // Check if the email already exists
    const existingEntry = await ContactUs.findOne({ email });

    if (existingEntry) {
      // Email exists, append the message to the messages array
      existingEntry.messages.push(message);
      await existingEntry.save();
    } else {
      // Email does not exist, create a new entry
      const newMessage = new ContactUs({
        name,
        email,
        messages: [message], // Initialize messages array with the first message
      });
      await newMessage.save();
    }

    // Return success response
    return NextResponse.json({ message: "Message saved successfully!" });
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { error: "An error occurred while saving the message." },
      { status: 500 }
    );
  }
}
