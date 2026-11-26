import { NextResponse } from "next/server";
import { getBackendStatus } from "@/lib/backend/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getBackendStatus();
    return NextResponse.json({
      success: true,
      status: "online",
      ...status,
    });
  } catch (error: any) {
    console.error("GET /api/health error:", error);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
