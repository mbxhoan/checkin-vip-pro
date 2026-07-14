"use client";

import { PasswordIcon } from "@/assets/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InputGroup from "../FormElements/InputGroup";

export default function ResetPasswordForm() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [recoveryReady, setRecoveryReady] = useState(false);

  useEffect(() => {
    const recoverSession = async () => {
      const url = new URL(window.location.href);
      const hasRecoveryCode = url.searchParams.has("code");

      if (!hasRecoveryCode) {
        setRecoveryReady(true);
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href,
      );

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setRecoveryReady(true);
      setLoading(false);
    };

    void recoverSession();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    setSuccessMessage("Password updated. Redirecting to sign in.");
    router.refresh();
    router.push("/auth/sign-in?reset=1");
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-stroke bg-gray-2 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
        Preparing your recovery session...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputGroup
        type="password"
        label="New password"
        className="[&_input]:py-[15px]"
        placeholder="Enter a new password"
        name="password"
        handleChange={(event) => setPassword(event.target.value)}
        value={password}
        icon={<PasswordIcon />}
      />

      <InputGroup
        type="password"
        label="Confirm new password"
        className="[&_input]:py-[15px]"
        placeholder="Confirm the new password"
        name="confirmPassword"
        handleChange={(event) => setConfirmPassword(event.target.value)}
        value={confirmPassword}
        icon={<PasswordIcon />}
      />

      <button
        type="submit"
        disabled={!recoveryReady || submitting}
        className="flex w-full items-center justify-center rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Update password
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
