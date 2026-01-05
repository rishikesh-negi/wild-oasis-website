"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAlreadyBooked } from "../utils/isAlreadyBooked";
import { auth, signIn, signOut } from "./auth";
import { getBookedDatesByCabinId, getBooking } from "./data-service";
import { supabase } from "./supabase";

export async function signInAction(redirectTo) {
  const targetPath = redirectTo ?? "/account";
  await signIn("google", { redirectTo: targetPath });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}

export async function updateProfile(prevState, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in to perform this action");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (
    prevState.nationalID === nationalID &&
    prevState.nationality === nationality
  )
    return prevState;

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) throw new Error("Guest profile could not be updated");

  revalidatePath("/account/profile");

  return data;
}

export async function createReservation(reservationData, _, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in to perform this action");

  const newBooking = {
    ...reservationData,
    numGuests: Number.parseInt(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000),
  };

  // Server-side validation of selected date range:
  const cabinBookedDates = (
    await getBookedDatesByCabinId(reservationData.cabinId)
  )?.map(
    (date) =>
      new Date(date.getTime() - new Date().getTimezoneOffset() * 60 * 1000)
  );

  const rangeUnavailable = isAlreadyBooked(
    { from: reservationData.startDate, to: reservationData.endDate },
    cabinBookedDates
  );

  if (rangeUnavailable)
    throw new Error(
      "Your selected range overlaps with some dates of another reservation. Try a different date range or a different cabin."
    );

  // Create the new reservation:
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create reservation. Please try again");
  }

  revalidatePath("/account/reservations");
  revalidatePath(`/cabins/${reservationData.cabinId}`);

  return { status: "success", data };
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in to perform this action");

  const reservation = await getBooking(bookingId);

  // Prevent malicious users from deleting reservations not belonging to them:
  if (reservation.guestId !== session.user.guestId)
    throw new Error("You are not authorised to perform this action");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function editReservation(prevState, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in to perform this action");

  const { reservationId } = prevState;
  const reservation = await getBooking(reservationId);

  if (reservation.guestId !== session.user.guestId)
    throw new Error("You are not authorised to perform this action");

  const numGuests =
    Number.parseInt(formData.get("numGuests")) || prevState.numGuests;
  const observations = formData.get("observations").slice(0, 1000);

  if (
    prevState.numGuests === numGuests &&
    prevState.observations === observations
  )
    redirect("/account/reservations");

  const updateData = { numGuests, observations };

  const { data, error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", reservationId);

  if (error)
    throw new Error("Failed to update the reservation. Please try again.");

  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}
