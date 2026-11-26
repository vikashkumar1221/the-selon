import { NextRequest, NextResponse } from "next/server";
import { getSalonQueueStatus } from "@/lib/backend/queueService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get("salonId") || "salon_royal_crown";

    const queue = await getSalonQueueStatus(salonId);
    if (!queue) {
      return NextResponse.json(
        { success: false, error: "Salon queue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      queue,
    });
  } catch (error: any) {
    console.error("GET /api/queue error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch queue" },
      { status: 500 }
    );
  }
}
