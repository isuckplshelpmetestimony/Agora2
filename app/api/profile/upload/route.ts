import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/auth";
import { prisma } from "@/lib/prisma";

// This is a simplified implementation for profile picture uploads
// In a production environment, you would use a cloud storage service like AWS S3, Cloudinary, etc.

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // In a real implementation, you would:
    // 1. Parse the multipart form data to get the image file
    // 2. Upload the image to a cloud storage service
    // 3. Get the URL of the uploaded image
    // 4. Update the user's profile with the new image URL

    // For this example, we'll simulate the process by accepting an imageUrl in the request body
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image URL is required" },
        { status: 400 }
      );
    }

    // Update user profile with new image URL
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        image: imageUrl,
        updatedAt: new Date(),
      }
    });

    // Create activity record for profile picture update
    await prisma.activity.create({
      data: {
        userId: currentUser.id,
        type: "PROFILE_PICTURE_UPDATE",
        description: "Updated profile picture",
        metadata: JSON.stringify({
          previousImageUrl: currentUser.image,
          newImageUrl: imageUrl
        })
      }
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: "Profile picture updated successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Profile picture update error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}