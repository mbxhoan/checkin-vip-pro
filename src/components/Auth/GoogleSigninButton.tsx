"use client";

import { GoogleIcon } from "@/assets/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useState } from "react";

export default function GoogleSigninButton({ text }: { text: string }) {
  const supabase = getSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignin = async () => {
    setLoading(true);
    setErrorMessage(null);

    const redirectTo = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogleSignin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray-2 p-[15px] font-medium hover:bg-opacity-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-opacity-50"
      >
        <GoogleIcon />
        {text} with Google
      </button>

      {errorMessage ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
