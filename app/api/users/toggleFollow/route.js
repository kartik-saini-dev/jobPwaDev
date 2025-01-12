import connectToDb from "@/database";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDb();
    const { userId, followerId } = await req.json();

    if (!userId || !followerId) {
      return NextResponse.json({ message: "Invalid data provided" }, { status: 400 });
    }



    const user = await User.findById(userId);
    const recruiter = await User.findById(followerId);

    if (!user || !recruiter) {
      return NextResponse.json({ message: "User or recruiter not found" }, { status: 404 });
    }

    // Safely check if user is already following the recruiter
    const isAlreadyFollowing = user.following.some(
      entry => entry?.userId?.toString() === followerId
    );

    if (isAlreadyFollowing) {
      // Unfollow logic
      user.following = user.following.filter(
        entry => entry?.userId?.toString() !== followerId
      );
      recruiter.followers = recruiter.followers.filter(
        entry => entry?.userId?.toString() !== userId
      );
    } else {
      // Follow logic
      user.following.push({ userId: followerId });
      recruiter.followers.push({ userId: userId });
    }

    await user.save();
    await recruiter.save();

    return NextResponse.json({ isFollowing: !isAlreadyFollowing }, { status: 200 });
  } catch (error) {
    console.error("Error toggling follow/unfollow:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
