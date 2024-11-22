"use client";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import SessionLoading from "@/components/SessionLoading";
import bottom from "../../app/bottom.png";
import Image from "next/image";

export default function DashboardLayout({ children }) {
  const { session, isLoading } = useSelector((state) => state.user);

  if (isLoading) {
    return <SessionLoading />;
  }

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background relative ">
      {children}
      <div className="absolute bottom-0">
        <Image src={bottom} alt="bottom decoration" width={2200} height={200} />
      </div>
    </div>
  );
}
