"use client";

import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InputGroup from "../FormElements/InputGroup";

type SignUpState = {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpWithPassword() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [data, setData] = useState<SignUpState>({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setSuccessMessage(null);

    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { data: signUpResult, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/sign-in?signup=confirmed`,
        data: {
          full_name: data.fullName,
          display_name: data.fullName,
          company_name: data.companyName || null,
          source: "self-service-sign-up",
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (signUpResult.session) {
      router.refresh();
      router.push("/");
      return;
    }

    setSuccessMessage(
      "Account created. Check your email to confirm the sign-up link before logging in.",
    );
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputGroup
        type="text"
        label="Full name"
        className="[&_input]:py-[15px]"
        placeholder="Enter your full name"
        name="fullName"
        handleChange={handleChange}
        value={data.fullName}
        icon={<UserIcon />}
      />

      <InputGroup
        type="text"
        label="Company name"
        className="[&_input]:py-[15px]"
        placeholder="Enter your company name"
        name="companyName"
        handleChange={handleChange}
        value={data.companyName}
        icon={<UserIcon />}
      />

      <InputGroup
        type="email"
        label="Email"
        className="[&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="[&_input]:py-[15px]"
        placeholder="Create a password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <InputGroup
        type="password"
        label="Confirm password"
        className="[&_input]:py-[15px]"
        placeholder="Confirm your password"
        name="confirmPassword"
        handleChange={handleChange}
        value={data.confirmPassword}
        icon={<PasswordIcon />}
      />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Create account
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
