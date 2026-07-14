"use client";

import { EmailIcon } from "@/assets/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useState } from "react";
import InputGroup from "../FormElements/InputGroup";

export default function ForgotPasswordForm() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setSuccessMessage(
      "Password reset email sent. Follow the link in your inbox to choose a new password.",
    );
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputGroup
        type="email"
        label="Email"
        className="[&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={(event) => setEmail(event.target.value)}
        value={email}
        icon={<EmailIcon />}
      />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Send reset link
      </button>

      {errorMessage ? (
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {successMessage}
        </p>
      ) : null}
    </form>
  );
}
