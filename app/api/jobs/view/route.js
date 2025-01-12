import connectToDb from '@/database';
import Job from '@/models/job';
import { NextResponse } from 'next/server';

export async function POST(req) {


  try {
    await connectToDb();
    const { userId, jobId } = await req.json();

    if (!userId || !jobId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or jobId' },
        { status: 400 }
      );
    }

    // Atomically update the document
    const result = await Job.findOneAndUpdate(
      {
        _id: jobId,
        views: { $ne: userId }, // Ensure userId is not already in views array
      },
      {
        $addToSet: { views: userId }, // Add userId to views array
        $inc: { viewCount: 1 },      // Increment viewCount
      },
      { new: true } // Return the updated document
    );

    if (!result) {
      return NextResponse.json(
        { success: true, message: 'Job not updated. User may have already viewed this job.' }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'View count updated',
      viewCount: result.viewCount,
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}