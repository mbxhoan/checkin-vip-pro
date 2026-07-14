"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useI18n } from "@/lib/i18n/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";

export default function SigninWithPassword() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const { messages } = useI18n();
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label={messages.auth.email}
        className="mb-4 [&_input]:py-[15px]"
        placeholder={messages.auth.enterEmail}
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label={messages.auth.password}
        className="mb-5 [&_input]:py-[15px]"
        placeholder={messages.auth.enterPassword}
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label={messages.common.rememberMe}
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          {messages.common.forgotPassword}
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          {messages.common.signIn}
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>

      {errorMessage ? (
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
