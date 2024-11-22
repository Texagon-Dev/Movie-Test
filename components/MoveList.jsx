"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { deleteMovie, fetchMovies } from "@/redux/features/movieSlice";
import PageLayout from "./PageLayout";
import SessionLoading from "./SessionLoading";
import { signOut } from "@/redux/features/userSlice";
import { EmptyState } from "./EmptyState";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

export default function MovieList() {

  const [movieToDelete, setMovieToDelete] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { movies, currentPage, totalPages, status, error } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    dispatch(fetchMovies({ page, limit: 8 }));
  }, [dispatch, searchParams]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`, { scroll: true });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <SessionLoading />
      </div>
    );
  }

  if (error) {
    return (
      <PageLayout title="Error" showAddButton={false} showLogout={true}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchMovies({ page: 1, limit: 8 }))}
            className="px-4 py-2 bg-emerald-400 rounded-md hover:bg-emerald-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </PageLayout>
    );
  }

  if (movies.length === 0 && currentPage === 1) {
    return <EmptyState />;
  }

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (totalPages - start < maxButtons - 1) {
      start = Math.max(1, totalPages - maxButtons + 1);
    }

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 rounded-md text-white hover:bg-teal-800/50 transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>
      );
    }

    // First page and ellipsis
    if (start > 1) {
      buttons.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 rounded-md text-white hover:bg-teal-800/50 transition-colors"
          aria-label="Go to first page"
        >
          1
        </button>
      );
      if (start > 2) {
        buttons.push(
          <span key="ellipsis1" className="text-white px-2" aria-hidden="true">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentPage === i
              ? "bg-emerald-400 text-white"
              : "text-white hover:bg-teal-800/50"
          }`}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis
    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="text-white px-2" aria-hidden="true">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 rounded-md text-white hover:bg-teal-800/50 transition-colors"
          aria-label="Go to last page"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 rounded-md text-white hover:bg-teal-800/50 transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      );
    }

    return buttons;
  };

  const handleLogout = async () => {
    try {
      await dispatch(signOut()).unwrap();
      router.push("/signin");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const getImageUrl = (posterUrl) => {
    if (!posterUrl) return null;
    if (posterUrl.startsWith("http")) return posterUrl;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/movie_posters/${posterUrl}`;
  };

  const handleDeleteClick = (e, movie) => {
    e.preventDefault();
    e.stopPropagation();
    setMovieToDelete(movie);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteMovie(movieToDelete.id)).unwrap();
      const page = Number(searchParams.get("page")) || 1;
      dispatch(fetchMovies({ page, limit: 8 }));
    } catch (error) {
      console.error("Failed to delete movie:", error);
    } finally {
      setMovieToDelete(null);
    }
  };

	return (
    <>
      <PageLayout
        title="My movies"
        showAddButton={true}
        showLogout={true}
        onLogout={handleLogout}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-20">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/edit/${movie.id}`}
              className="bg-[#092C39] rounded-lg overflow-hidden group hover:ring-2 hover:ring-emerald-400 transition-all"
              aria-label={`Edit ${movie.title} (${movie.publishing_year})`}
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src={getImageUrl(movie.poster_url)}
                  alt={`${movie.title} poster`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  priority={false}
                />
                <button
                  onClick={(e) => handleDeleteClick(e, movie)}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label={`Delete ${movie.title}`}
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-4">
                <h2 className="text-white font-semibold line-clamp-1">
                  {movie.title}
                </h2>
                <p className="text-gray-400">{movie.publishing_year}</p>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            className="flex justify-center space-x-4 py-40"
            aria-label="Pagination"
          >
            {renderPaginationButtons()}
          </nav>
        )}
      </PageLayout>
      <ConfirmDialog
        isOpen={!!movieToDelete}
        onClose={() => setMovieToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Movie"
        message={
          movieToDelete
            ? `Are you sure you want to delete "${movieToDelete.title}"? This action cannot be undone.`
            : ""
        }
      />
    </>
  );
}
