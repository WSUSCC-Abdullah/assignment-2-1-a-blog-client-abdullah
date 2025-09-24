import { NextRequest, NextResponse } from "next/server";
import { getActivePosts } from "@repo/db/service";

export async function GET(request: NextRequest) {
  try {
    const posts = await getActivePosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}