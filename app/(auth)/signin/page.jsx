"use client";

import { SignIn } from "@/components/auth/SignIn";
import { withPublicRoute } from "@/lib/withPublicRoute";


function SignInPage() {
  return <SignIn />;
}

export default withPublicRoute(SignInPage);