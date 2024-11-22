"use client";

import { CreateMovie } from "@/components/CreateMovie";
import { withAuth } from "@/lib/withAuth";

function CreateMoviePage() {
  return <CreateMovie />;
}

export default withAuth(CreateMoviePage);
