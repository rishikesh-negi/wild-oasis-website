"use server";

import { signIn, signOut } from "./auth";

export async function signInAction(redirectTo) {
  const targetPath = redirectTo ?? "/account";
  await signIn("google", { redirectTo: targetPath });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}

export async function updateProfile() {
  console.log("Update profile server action");
}
