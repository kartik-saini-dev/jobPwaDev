
import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import { User } from "@/models/user";
import xss from "xss";
import Joi from "joi";

const schema = Joi.object({
  fullname: Joi.string().allow(""),
  description: Joi.string().allow(""),
  img: Joi.string().allow(""),
});

export async function PUT(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Parse request body
    let data = {};
    try {
      data = await req.json();
    } catch (error) {
     
    }

    // Condition 1: Update last seen if both userId and status are provided
    if (userId && status) {
      const updatedLastSeen = await User.findByIdAndUpdate(
        userId,
        {
          $set: { lastSeen: new Date(), online: status },
        },
        { new: true }
      );

      if (!updatedLastSeen) {
        return NextResponse.json({
          success: false,
          message: "Failed to update last seen. User not found.",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Last seen updated successfully.",
      });
    }

    // Condition 2: Update profile if userId and data are provided
    if (userId && Object.keys(data).length > 0) {
      const {  fullName, img, description } = data;

      // Sanitize input
      const sanitizedData = {
        fullname: xss(fullName || ""),
        description: xss(description || ""),
        img: xss(img || ""),
      };
     
      // Validate data
      const { error } = schema.validate(sanitizedData);
      if (error) {
        return NextResponse.json({
          success: false,
          message: `Validation error: ${error.details[0].message}`,
        });
      }
       
      const updatedProfile = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            fullName: sanitizedData.fullname,
            avatar: sanitizedData.img,
            description: sanitizedData.description,
          },
        },
        { new: true }
      );

      if (!updatedProfile) {
        return NextResponse.json({
          success: false,
          message: "Failed to update profile. User not found.",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully.",
        avatar:updatedProfile.avatar,
      });
    }

    // Default case: Missing required parameters
    return NextResponse.json({
      success: false,
      message: "Invalid request. Provide either status or profile data along with userId.",
    });
  } catch (error) {
    console.error("Error while processing request:", error);

    return NextResponse.json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
}
