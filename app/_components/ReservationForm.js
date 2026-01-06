"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { differenceInDays } from "date-fns";
import Image from "next/image";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { createReservation } from "../_lib/actions";
import { useReservation } from "../contexts/ReservationContext";
import ReservationSuccessToast from "./ReservationSuccessToast";
import SubmitActionButton from "./SubmitActionButton";

function ReservationForm({ cabin, user }) {
  const {
    maxCapacity,
    regularPrice,
    discount,
    id: cabinId,
    name: cabinName,
  } = cabin;
  const { range, resetRange } = useReservation();

  const numNights = differenceInDays(range?.to, range?.from);
  const cabinPrice = numNights * regularPrice - discount;

  const startDate = range?.from;
  const endDate = range?.to;

  const reservationData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    extrasPrice: 0,
    totalPrice: cabinPrice,
    status: "unconfirmed",
    hasBreakfast: false,
    isPaid: false,
    cabinId,
    guestId: user?.guestId,
  };

  const createReservationWithData = createReservation.bind(
    null,
    reservationData
  );

  const [state, formAction, isPending] = useActionState(async function (
    prevState = null,
    formData
  ) {
    const { status } = await createReservationWithData(prevState, formData);
    if (status === "success") {
      resetRange();
      toast.custom(
        (t) => (
          <ReservationSuccessToast
            isVisible={t?.visible}
            cabinName={cabinName}
            startDate={startDate}
            endDate={endDate}
            toastId={t.id}
            icon={t.icon}
          />
        ),
        {
          icon: <CheckCircleIcon className="h-8 w-8 fill-green-500" />,
          duration: 5000,
        }
      );
    }
  },
  null);

  return (
    <div className="grid transition-all duration-100">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-3 items-center">
          <Image
            width={32}
            height={32}
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={formAction}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
        key={`${cabinId}-${user.guestId}-${numNights}`}>
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-4 py-2 h-fit bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm border-r-6 border-primary-200"
            required>
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="relative flex justify-end items-center gap-6">
          <span className="invisible block px-8 py-8"></span>
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitActionButton
              isPending={isPending}
              buttonText={"Reserve now"}>
              Reserve now
            </SubmitActionButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
