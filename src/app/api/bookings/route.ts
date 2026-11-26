import { NextRequest, NextResponse } from "next/server";
import { getAllBookings, createBooking } from "@/lib/backend/bookingService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get("salonId") || undefined;
    const customerId = searchParams.get("customerId") || undefined;
    const customerPhone = searchParams.get("phone") || undefined;
    const status = searchParams.get("status") || undefined;
    const date = searchParams.get("date") || undefined;

    const bookings = await getAllBookings({
      salonId,
      customerId,
      customerPhone,
      status,
      date,
    });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.salonId || !body.customerName || !body.bookingDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: salonId, customerName, bookingDate",
        },
        { status: 400 }
      );
    }

    const booking = await createBooking(body);
    return NextResponse.json(
      {
        success: true,
        message: "Booking created and queue token issued successfully",
        booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
