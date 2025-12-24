import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  const { cabinId } = await params;

  try {
    const { cabin, bookedDates } = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch (err) {
    return Response.json({ message: "Cabin not found" });
  }
}

// export async function POST() {}

// export async function PUT() {}

// export async function PATCH() {}

// export async function DELETE() {}

// export async function OPTIONS() {}
