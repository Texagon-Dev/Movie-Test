"use client";

import MovieList from "@/components/MoveList";
import { withAuth } from "@/lib/withAuth";

function HomePage() {
  return <MovieList />;
}

export default withAuth(HomePage);
