import EditReservationForm from "@/app/_components/EditReservationForm";
import { getBooking, getBookings, getCabin } from "@/app/_lib/data-service";
import { use } from "react";

export const metadata = {
  title: `Edit reservation`,
};

export default function Page({ params }) {
  const { reservationId } = use(params);
  const reservation = use(getBooking(reservationId));
  const cabin = use(getCabin(reservation.cabinId));

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
      </h2>

      <EditReservationForm reservation={reservation} cabin={cabin} />
    </div>
  );
}
