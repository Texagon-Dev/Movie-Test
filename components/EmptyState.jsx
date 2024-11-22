"use client";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/redux/features/userSlice";

export function EmptyState() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(signOut()).unwrap();
      router.push("/signin");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="text-white hover:text-primary transition-colors flex items-center gap-2"
        >
          <p>Logout</p>
          <LogOut className="w-6 h-6" />
        </button>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            Your movie list is empty
          </h1>
          <Link
            href="/create"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 transition-colors"
          >
            Add a new movie
          </Link>
        </div>
      </div>
    </div>
  );
}
