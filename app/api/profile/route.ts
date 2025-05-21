import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/auth";
import { prisma } from "@/lib/prisma";

// GET /api/profile - Get current user profile
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user with activities
    const userWithActivities = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    // Remove password from response
    if (userWithActivities) {
      const { password, ...userWithoutPassword } = userWithActivities;
      return NextResponse.json(userWithoutPassword);
    }

    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update user profile
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      name, 
      bio, 
      location, 
      jobTitle, 
      phoneNumber, 
      website,
      preferences 
    } = body;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        bio,
        location,
        jobTitle,
        phoneNumber,
        website,
        preferences: preferences ? JSON.stringify(preferences) : undefined,
        updatedAt: new Date(),
      }
    });

    // Create activity record for profile update
    await prisma.activity.create({
      data: {
        userId: currentUser.id,
        type: "PROFILE_UPDATE",
        description: "Updated profile information",
        metadata: JSON.stringify({
          updatedFields: Object.keys(body)
        })
      }
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}