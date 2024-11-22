"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/redux/features/userSlice";
import bottom from "../../app/bottom.png"
import Image from "next/image";

export function SignUp() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { error, isLoading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        signUp({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign up:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-[64px] font-semibold text-white text-center mb-8">
          Sign up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          {passwordError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-md p-3 text-sm">
              {passwordError}
            </div>
          )}
          <div className="space-y-4">
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              className="w-full p-3 rounded-md bg-input text-white placeholder-gray-400 border border-card"
              required
            />
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
              className="w-full p-3 rounded-md bg-input text-white placeholder-gray-400 border border-card"
              required
              minLength={6}
            />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm Password"
              className="w-full p-3 rounded-md bg-input text-white placeholder-gray-400 border border-card"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/80 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
          <p className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </form>
      </div>
      <div className="absolute bottom-0">
        <Image src={bottom} alt="bottom decoration" width={2200} height={200} />
      </div>
    </div>
  );
}
