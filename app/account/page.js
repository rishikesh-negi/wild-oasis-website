import { use } from "react";
import { auth } from "../_lib/auth";

export const metadata = {
  title: "Account",
};

export default function Page() {
  const session = use(auth());
  const firstName = session.user.name.split(" ")[0];

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstName || "User"}
    </h2>
  );
}
