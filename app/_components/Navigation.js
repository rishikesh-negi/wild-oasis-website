import Link from "next/link";
import { Suspense } from "react";
import SpinnerMini from "./SpinnerMini";
import UserProfileNavLink from "./UserProfileNavLink";

export default function Navigation() {
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors">
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors">
            About
          </Link>
        </li>
        <li>
          <Suspense fallback={<SpinnerMini />}>
            <UserProfileNavLink />
          </Suspense>
        </li>
      </ul>
    </nav>
  );
}
