"use client";

import { SignUp } from "@/components/auth/SignUp";
import { withPublicRoute } from "@/lib/withPublicRoute";


function SignUpPage() {
  return <SignUp />;
}

export default withPublicRoute(SignUpPage);