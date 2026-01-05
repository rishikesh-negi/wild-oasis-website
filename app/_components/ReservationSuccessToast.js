import { format, parseISO } from "date-fns";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

function ReservationSuccessToast({
  isVisible,
  cabinName,
  startDate,
  endDate,
  toastId,
  icon,
}) {
  return (
    <div
      className={`${
        isVisible ? "animate-custom-enter" : "animate-custom-leave"
      } max-w-2xl w-full bg-gray-950 shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-accent-500 text-primary-100`}>
      <div className="flex-1 flex items-center gap-2 px-4 py-2 w-0">
        {icon && <span>{icon}</span>}
        <div className="flex items-center">
          <div className="ml-2">
            <p className="font-semibold text-accent-400">
              Reservation successfully made!
            </p>
            <span className="font-bold">Cabin #{cabinName}</span>
            <p className="text-sm font-semibold tracking-wide">
              {format(parseISO(startDate?.toISOString()), "EEE, MMM dd yyyy")}{" "}
              &mdash;{" "}
              {format(parseISO(endDate?.toISOString()), "EEE, MMM dd yyyy")}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          toast.dismiss(toastId);
          redirect("/account/reservations");
        }}
        className="max-w-[25%] w-fit h-full px-2 py-2 rounded-r-[inherit] border-l border-accent-500 text-accent-400 cursor-pointer underline underline-offset-3 hover:text-accent-300 focus:outline-none focus:ring-2 focus:ring-accent-500">
        Manage reservations
      </button>
    </div>
  );
}

export default ReservationSuccessToast;
