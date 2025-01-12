import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import connectToDB from "@/database"; // Importing DB connection

// Make the route dynamic
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    
      await connectToDB();
      
    const token = req.headers.get("cookie")?.split("=")[1];
      
        
        
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Return user type if token is valid
    return NextResponse.json({
      success: true,
      userType: decoded.userType,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
