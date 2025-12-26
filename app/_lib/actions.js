"use server";

import { signIn, signOut } from "./auth";

export async function signInAction(redirectTo) {
  const redirectionPath = redirectTo ?? "/account";
  await signIn("google", { redirectTo: redirectionPath });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}
