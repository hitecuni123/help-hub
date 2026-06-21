import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: id,
        },
      },
    });

    // --------------------
    // UNLIKE
    // --------------------
    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: id,
          },
        },
      });

      await prisma.post.update({
        where: { id },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({
        liked: false,
      });
    }

    // --------------------
    // LIKE
    // --------------------
    await prisma.like.create({
      data: {
        postId: id,
        userId: user.id,
      },
    });

    await prisma.post.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      liked: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}