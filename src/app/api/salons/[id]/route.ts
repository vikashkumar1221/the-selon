import { NextRequest, NextResponse } from "next/server";
import { getSalonById, updateSalon } from "@/lib/backend/salonService";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const salon = await getSalonById(params.id);
    if (!salon) {
      return NextResponse.json(
        { success: false, error: "Salon not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, salon });
  } catch (error: any) {
    console.error(`GET /api/salons/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get salon" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateSalon(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Salon not found to update" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Salon updated successfully",
      salon: updated,
    });
  } catch (error: any) {
    console.error(`PATCH /api/salons/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update salon" },
      { status: 500 }
    );
  }
}
