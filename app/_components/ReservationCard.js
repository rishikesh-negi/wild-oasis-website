import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  format,
  formatDistance,
  isFuture,
  isPast,
  isToday,
  isWithinInterval,
  parseISO,
} from "date-fns";
import DeleteReservation from "@/app/_components/DeleteReservation";
import Image from "next/image";
import Link from "next/link";

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

function ReservationCard({ booking }) {
  const {
    id,
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    status,
    created_at,
    cabins: { name, image },
  } = booking;

  const statusTextColor =
    status === "unconfirmed" ? "text-yellow-500" : "text-green-500";

  const hasElapsed = isPast(new Date(endDate));
  const isOngoing = isWithinInterval(new Date(), {
    start: new Date(startDate),
    end: new Date(endDate),
  });
  const isUpcoming = isFuture(new Date(startDate));

  const editAndDeleteDisabled = hasElapsed || status !== "unconfirmed";

  return (
    <div className="h-fit flex border border-primary-800">
      <div className="relative aspect-square w-[15%]">
        <Image
          src={image}
          alt={`Cabin ${name}`}
          fill
          className="object-cover border-r border-primary-800"
          priority
        />
      </div>

      <div className="grow px-6 py-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {numNights} nights in Cabin {name}
          </h3>
          {hasElapsed && (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="bg-orange-800 text-orange-100 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                elapsed
              </span>
              <span className={`text-[0.7rem] ${statusTextColor} uppercase`}>
                {status}
              </span>
            </div>
          )}
          {isUpcoming && (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                upcoming
              </span>
              <span className={`text-[0.7rem] ${statusTextColor} uppercase`}>
                {status}
              </span>
            </div>
          )}
          {isOngoing && (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="bg-cyan-800 text-cyan-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                ongoing
              </span>
              <span className={`text-[0.7rem] ${statusTextColor} uppercase`}>
                {status}
              </span>
            </div>
          )}
        </div>

        <p className="text-lg text-primary-300">
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>

        <div className="flex gap-5 mt-auto items-baseline">
          <p className="text-xl font-semibold text-accent-400">${totalPrice}</p>
          <p className="text-primary-300">&bull;</p>
          <p className="text-lg text-primary-300">
            {numGuests} guest{numGuests > 1 && "s"}
          </p>
          <p className="ml-auto text-sm text-primary-400">
            Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
          </p>
        </div>
      </div>

      <div className="flex flex-col border-l border-primary-800 w-[100px]">
        <Link
          href={editAndDeleteDisabled ? "" : `/account/reservations/edit/${id}`}
          className={`group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900 ${
            editAndDeleteDisabled &&
            "text-primary-700 hover:text-primary-700 hover:*:text-primary-700 cursor-not-allowed hover:bg-transparent pointer-events-none transition-none"
          }`}>
          <PencilSquareIcon
            className={`h-5 w-5 text-primary-500 group-hover:text-primary-800 transition-colors ${
              editAndDeleteDisabled && "text-primary-700"
            }`}
          />
          <span className="mt-1">Edit</span>
        </Link>
        <DeleteReservation
          bookingId={id}
          editAndDeleteDisabled={editAndDeleteDisabled}
        />
      </div>
    </div>
  );
}

export default ReservationCard;
