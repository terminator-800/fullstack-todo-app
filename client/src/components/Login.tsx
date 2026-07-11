// src/components/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSchema, type LoginFormValues } from "../schemas/authSchema";
import { useAuth } from "../store/auth";
import api from "../api/axios";

// All page text lives here — edit this object to change any copy on the page
const loginContent = {
  brand: {
    logoLetter: "T",
    name: "Todo",
  },
  heading: {
    title: "Welcome back",
    subtitle: "Log in to pick up your todo's where you left off.",
  },
  form: {
    emailLabel: "EMAIL",
    emailPlaceholder: "you@example.com",
    passwordLabel: "PASSWORD",
    passwordPlaceholder: "••••••••",
    submitButton: "Log in",
    submitButtonLoading: "Logging in...",
  },
  links: {
    forgotPassword: {
      text: "Forgot password?",
      href: "/forgot-password",
    },
    verificationCode: {
      text: "Have a verification code?",
      href: "/verify",
    },
    signup: {
      prompt: "New to Todo?",
      text: "Create an account",
      href: "/signup",
    },
  },
} as const;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await api.post("/login", data);
      const { user } = res.data;

      login(user); 
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("password", { message: "Invalid email or password" });
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
                {loginContent.brand.logoLetter}
              </span>
            </div>
            <span className="font-serif text-xl font-bold text-slate-900">
              {loginContent.brand.name}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-slate-900">
            {loginContent.heading.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {loginContent.heading.subtitle}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600"
              >
                {loginContent.form.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                placeholder={loginContent.form.emailPlaceholder}
                {...register("email")}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600"
              >
                {loginContent.form.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                placeholder={loginContent.form.passwordPlaceholder}
                {...register("password")}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
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
                ? loginContent.form.submitButtonLoading
                : loginContent.form.submitButton}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <a href={loginContent.links.forgotPassword.href} className="text-emerald-700 hover:text-emerald-800"> 
              {loginContent.links.forgotPassword.text}
            </a>

            <a href={loginContent.links.verificationCode.href} className="text-emerald-700 hover:text-emerald-800">
              {loginContent.links.verificationCode.text}
            </a>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
            {loginContent.links.signup.prompt}{" "}
            <a href={loginContent.links.signup.href} className="font-semibold text-slate-900 hover:text-emerald-700">
              {loginContent.links.signup.text}
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}