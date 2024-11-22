"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import PageLayout from "./PageLayout";
import { MovieForm } from "./MovieForm";
import { addMovie } from "@/redux/features/movieSlice";

export function CreateMovie() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await dispatch(addMovie(formData)).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Failed to create movie:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Create a new movie">
      <MovieForm
        initialData={null}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText={isSubmitting ? "Submitting..." : "Submit"}
      />
    </PageLayout>
  );
}
