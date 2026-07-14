import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
import { useI18n } from "@/lib/i18n/client";

export default function Signin() {
  const { messages } = useI18n();

  return (
    <>
      <GoogleSigninButton label={messages.auth.signInWithGoogle} />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          {messages.auth.signInWithEmail}
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          {messages.common.noAccountYet}{" "}
          <Link href="/auth/sign-up" className="text-primary">
            {messages.common.signUp}
          </Link>
        </p>
      </div>
    </>
  );
}
