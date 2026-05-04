"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, registerUser } from "../services/api";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = isLogin
        ? {
            username: form.username,
            password: form.password,
          }
        : {
            name: form.name,
            username: form.username,
            email: form.email,
            password: form.password,
          };

      const response = isLogin
        ? await login(payload)
        : await registerUser(payload);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authUser", response.username);
      window.dispatchEvent(new Event("authChanged"));
      navigate("/");
    } catch (err) {
      setError(
        err.message || "Unable to complete authentication. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/95 p-8 shadow-2xl shadow-slate-900/5">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 dark:text-purple-400 font-semibold">
            {isLogin ? "Welcome back" : "Create an account"}
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {isLogin ? "Login to your shop account" : "Register a new account"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {isLogin
              ? "Enter your username and password to continue."
              : "Fill in your details to register and start shopping."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/70 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Full name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
            />
          </label>

          {!isLogin && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address
              </span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-purple-600 dark:hover:bg-purple-500"
          >
            {isSubmitting ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 dark:text-purple-300 hover:underline"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              Already registered?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 dark:text-purple-300 hover:underline"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
