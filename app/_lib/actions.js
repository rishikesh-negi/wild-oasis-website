"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBooking } from "./data-service";

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

  revalidatePath("/account");

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
