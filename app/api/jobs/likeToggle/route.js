import { NextResponse } from 'next/server';
import connectToDb from '@/database'; // Database connection utility
import Job from '@/models/job'; // Job schema
import mongoose from 'mongoose'; // Import mongoose to work with ObjectId

export async function POST(req) {
  try {
    await connectToDb(); // Ensure the database connection

    const { userId, jobId } = await req.json();

    // Validate inputs
    if (!userId || !jobId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or jobId' },
        { status: 400 }
      );
    }

    // Convert userId to ObjectId type
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if the user has already liked the job
    const hasLiked = job.likes.some((like) => like.toString() === userObjectId.toString());

    if (hasLiked) {
      // Remove the like if already liked
      job.likes = job.likes.filter((id) => id.toString() !== userObjectId.toString());
    } else {
      // Add the like if not liked
      job.likes.push(userObjectId);
    }

    // Save changes to the job document
    await job.save();

    return NextResponse.json({
      success: true,
      message: hasLiked ? 'Job unliked' : 'Job liked',
      hasLiked: !hasLiked, // Return the new state
      totalLikes: job.likes.length, // Optionally include the total likes count
    });
  } catch (error) {
    console.error('[toggleLike]', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
