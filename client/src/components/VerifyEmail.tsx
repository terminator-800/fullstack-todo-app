// src/components/VerifyEmail.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import { verifyEmailSchema, type VerifyEmailFormValues } from "../schemas/authSchema";
import { useAuth } from "../store/auth";

// All page text lives here — edit this object to change any copy on the page
const verifyEmailContent = {
  brand: {
    logoLetter: "L",
    name: "Ledger",
  },
  heading: {
    title: "Verify your email",
    subtitle: "Enter your email and the 4-digit code we sent you.",
  },
  form: {
    emailLabel: "EMAIL",
    emailPlaceholder: "you@example.com",
    codeLabel: "VERIFICATION CODE",
    codePlaceholder: "1 2 3 4",
    submitButton: "Verify email",
    submitButtonLoading: "Verifying...",
    resendButton: "Resend code",
    resendButtonLoading: "Resending...",
  },
  links: {
    backToLogin: {
      text: "Back to log in",
      href: "/login",
    },
  },
} as const;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuth((state) => state.login);

  const emailFromSignup = (location.state as { email?: string } | null)?.email ?? "";

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: emailFromSignup,
    },
  });

  const onSubmit = async (data: VerifyEmailFormValues) => {
    try {
      const res = await api.post("/verify-email", data);
      const { user } = res.data;

      login(user);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError("code", { message: "Invalid or expired verification code" });
      } else if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("email", { message: "No account found with this email" });
      } else {
        setError("root", { message: "Something went wrong. Try again." });
      }
    }
  };

  const handleResend = async () => {
    const email = getValues("email");

    if (!email) {
      setError("email", { message: "Enter your email first" });
      return;
    }

    try {
      await api.post("/resend-code", { email });
    } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      setError("root", { message: err.response.data.message });
    } else {
      setError("root", { message: "Could not resend code. Try again." });
    }
  }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-stone-100 px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-700 via-emerald-600 to-amber-500" />

        <div className="px-10 py-9">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <span className="font-serif text-lg font-bold text-white">
                {verifyEmailContent.brand.logoLetter}
              </span>
            </div>
            <span className="font-serif text-xl font-bold text-slate-900">
              {verifyEmailContent.brand.name}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-slate-900">
            {verifyEmailContent.heading.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {verifyEmailContent.heading.subtitle}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600"
              >
                {verifyEmailContent.form.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                placeholder={verifyEmailContent.form.emailPlaceholder}
                {...register("email")}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="code"
                className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600"
              >
                {verifyEmailContent.form.codeLabel}
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder={verifyEmailContent.form.codePlaceholder}
                {...register("code")}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tracking-widest text-slate-900 placeholder:text-slate-400 placeholder:tracking-widest focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
              )}
            </div>

            {errors.root && (
              <p className="text-xs text-red-600">{errors.root.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 active:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? verifyEmailContent.form.submitButtonLoading
                : verifyEmailContent.form.submitButton}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="w-full rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
            >
              {verifyEmailContent.form.resendButton}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm">
            <a href={verifyEmailContent.links.backToLogin.href} className="font-semibold text-emerald-700 hover:text-emerald-800">
              {verifyEmailContent.links.backToLogin.text}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}