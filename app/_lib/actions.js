"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBooking } from "./data-service";
import { redirect } from "next/navigation";

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
