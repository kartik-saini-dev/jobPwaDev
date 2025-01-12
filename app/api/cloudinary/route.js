
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileURL } = body; // Unified handling for image/video URLs

    if (!fileURL) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "File URL is required",
        },
        { status: 400 }
      );
    }

    // Extract publicId from the fileURL
    const matches = fileURL.match(/\/upload\/(?:v\d+\/)?([^./]+)\.[a-z0-9]+$/i);
    const publicId = matches?.[1];

    if (!publicId) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Failed to extract public ID from the file URL",
        },
        { status: 400 }
      );
    }

    // Determine resource type
    const isVideo = fileURL.includes("/video/");
    const resourceType = isVideo ? "video" : "image";

  

    // Call Cloudinary's API to delete the file
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === "ok") {
      return NextResponse.json(
        {
          success: true,
          status: 200,
          message: `${resourceType} deleted successfully`,
          result,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          status: 500,
          message: `Failed to delete ${resourceType}. Cloudinary response was not 'ok'.`,
          result,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal Server Error. Failed to delete file.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
