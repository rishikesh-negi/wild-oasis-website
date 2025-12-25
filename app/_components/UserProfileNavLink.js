import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { auth } from "../_lib/auth";

function UserProfileNavLink() {
  const session = use(auth());

  // If there's no session, return null for now and return a "login/signup" button later:
  if (!session) return null;

  return (
    <Link
      href="/account"
      className="hover:text-accent-400 transition-colors flex items-center gap-3">
      <Image
        width={32}
        height={32}
        className="h-8 rounded-full"
        src={session.user.image}
        alt="User's avatar"
        referrerPolicy="no-referrer"
      />
      <span>Guest area</span>
    </Link>
  );
}

export default UserProfileNavLink;
