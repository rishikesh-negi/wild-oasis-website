"use client";

import { useActionState } from "react";
import { editReservation } from "../_lib/actions";
import SubmitActionButton from "./SubmitActionButton";

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
        <SubmitActionButton
          isPending={isPending}
          buttonText={"Update reservation"}>
          Update reservation
        </SubmitActionButton>
      </div>
    </form>
  );
}

export default EditReservationForm;
