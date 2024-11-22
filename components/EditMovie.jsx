"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { MovieForm } from "./MovieForm";
import { fetchMovie, updateMovie } from "@/redux/features/movieSlice";
import PageLayout from "./PageLayout";
import SessionLoading from "./SessionLoading";

export function EditMovie() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const movie = useSelector((state) => state.movies.currentMovie);
  const status = useSelector((state) => state.movies.status);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchMovie(params.id));
    }
  }, [dispatch, params.id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await dispatch(updateMovie({ id: params.id, formData })).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Failed to update movie:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" && !movie) {
    return <SessionLoading />;
  }

  if (!movie) {
    return (
      <PageLayout title="Movie Not Found">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Back to Movies
        </button>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Edit">
      <MovieForm
        initialData={movie}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText={isSubmitting ? "Updating..." : "Update"}
      />
    </PageLayout>
  );
}
