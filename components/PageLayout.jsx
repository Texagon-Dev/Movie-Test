"use client";
import Link from "next/link";
import Image from "next/image";
import { LogOut, ArrowLeft } from "lucide-react";
import bottom from "../app/bottom.png";

export default function PageLayout({
  title,
  children,
  showAddButton = false,
  showLogout = false,
  showBackButton = false,
  onLogout,
  onBack,
}) {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-16 pb-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={onBack}
                  className="text-white hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <h1 className="text-5xl font-semibold text-white">{title}</h1>
              {showAddButton && (
                <Link href="/create" className="text-white mt-4">
                  <div className="w-6 h-6 rounded-full bg-white text-teal-900 flex items-center justify-center">
                    +
                  </div>
                </Link>
              )}
            </div>
            {showLogout && (
              <button
                onClick={onLogout}
                className="text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <span>Logout</span>
                <LogOut className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
        <div className="pb-20">{children}</div>
      </div>
      <div className="absolute bottom-0  w-full">
        <Image
          src={bottom}
          alt="bottom decoration"
          width={1920}
          height={200}
          priority
          className="w-full"
        />
      </div>
    </div>
  );
}
