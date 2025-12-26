import Image from "next/image";
import { signInAction } from "../_lib/actions";

function SignInButton({ redirectTo }) {
  return (
    <form action={signInAction.bind(this, redirectTo)}>
      <button className="flex items-center gap-6 text-lg cursor-pointer hover:bg-primary-800 hover:text-accent-400 hover:[&>img]:scale-120 transition-all duration-150 border border-primary-800 px-8 py-4 font-medium">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          className="rounded-full antialiased"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
