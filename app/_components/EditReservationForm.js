"use client";

import { useActionState } from "react";
import { editReservation } from "../_lib/actions";
import SpinnerMini from "./SpinnerMini";

function EditReservationForm({ reservation, cabin }) {
  const { numGuests, observations, id: reservationId } = reservation;
  const { id: cabinId, maxCapacity } = cabin;

  const [state, formAction, isPending] = useActionState(editReservation, {
    numGuests,
    observations,
    reservationId: reservation.id,
  });

  return (
    <form
      action={formAction}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      key={`${numGuests}-${observations}`}>
      <div className="space-y-2">
        <label htmlFor="numGuests">How many guests?</label>
        <select
          name="numGuests"
          id="numGuests"
          defaultValue={numGuests || "default"}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full border-r-8 border-primary-200 shadow-sm rounded-sm"
          required>
          <option value="default" key="">
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
          defaultValue={observations || ""}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <button
          className="relative bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:pointer-events-none disabled:bg-gray-500 disabled:text-gray-300"
          disabled={isPending}>
          <span className="invisible block">Update reservation</span>
          <span className="absolute inset-0 flex items-center justify-center">
            {isPending ? <SpinnerMini /> : "Update reservation"}
          </span>
        </button>
      </div>
    </form>
  );
}

export default EditReservationForm;
