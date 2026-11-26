import { NextResponse } from "next/server";
import { getPlatformMetrics } from "@/lib/backend/metricsService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metrics = await getPlatformMetrics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error: any) {
    console.error("GET /api/metrics error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
