import { NextRequest, NextResponse } from "next/server";
import { getAllSalons, createSalon } from "@/lib/backend/salonService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || searchParams.get("q") || undefined;

    const salons = await getAllSalons({ city, category, status, search });
    return NextResponse.json({
      success: true,
      count: salons.length,
      salons,
    });
  } catch (error: any) {
    console.error("GET /api/salons error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch salons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Salon name is required" },
        { status: 400 }
      );
    }

    const created = await createSalon(body);
    return NextResponse.json(
      {
        success: true,
        message: "Salon registered successfully",
        salon: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/salons error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create salon" },
      { status: 500 }
    );
  }
}
