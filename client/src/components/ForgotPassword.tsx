// src/components/ForgotPassword.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas/authSchema";

// All page text lives here — edit this object to change any copy on the page
const forgotPasswordContent = {
  brand: {
    logoLetter: "L",
    name: "Ledger",
  },
  heading: {
    title: "Forgot password",
    subtitle: "Enter your email and we'll send a reset code.",
  },
  form: {
    emailLabel: "EMAIL",
    emailPlaceholder: "you@example.com",
    submitButton: "Send reset code",
    submitButtonLoading: "Sending...",
  },
  links: {
    backToLogin: {
      text: "Back to log in",
      href: "/login",
    },
  },
} as const;

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await axios.post("/forgot-password", data, {
        withCredentials: true,
      });

      navigate("/verify");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("email", { message: "No account found with this email" });
      } else {
        setError("root", { message: "Something went wrong. Try again." });
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
                {forgotPasswordContent.brand.logoLetter}
              </span>
            </div>
            <span className="font-serif text-xl font-bold text-slate-900">
              {forgotPasswordContent.brand.name}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-slate-900">
            {forgotPasswordContent.heading.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {forgotPasswordContent.heading.subtitle}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600"
              >
                {forgotPasswordContent.form.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                placeholder={forgotPasswordContent.form.emailPlaceholder}
                {...register("email")}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
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
                ? forgotPasswordContent.form.submitButtonLoading
                : forgotPasswordContent.form.submitButton}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm">
            <a href={forgotPasswordContent.links.backToLogin.href} className="font-semibold text-emerald-700 hover:text-emerald-800">
              {forgotPasswordContent.links.backToLogin.text}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}