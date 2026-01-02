"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { deleteReservation } from "../_lib/actions";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";

function DeleteReservation({ bookingId, editAndDeleteDisabled }) {
  const [isPending, startTransition] = useTransition();

  async function onClick() {
    if (editAndDeleteDisabled) return;
    if (confirm("Are you sure you want to delete this reservation?"))
      startTransition(() => deleteReservation(bookingId));
  }

  return (
    <button
      className={`group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900 ${
        editAndDeleteDisabled &&
        "text-primary-700 hover:text-primary-700 hover:*:text-primary-700 cursor-not-allowed hover:bg-transparent pointer-events-none transition-none"
      }`}
      disabled={editAndDeleteDisabled}
      onClick={onClick}>
      {isPending ? (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      ) : (
        <>
          <TrashIcon
            className={`h-5 w-5 text-primary-500 group-hover:text-primary-800 transition-colors ${
              editAndDeleteDisabled && "text-primary-700"
            }`}
          />
          <span
            className={`mt-1 ${editAndDeleteDisabled && "text-primary-700"}`}>
            Delete
          </span>
        </>
      )}
    </button>
  );
}

export default DeleteReservation;
