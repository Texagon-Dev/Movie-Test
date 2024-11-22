// redux/features/movieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ page = 1, limit = 8 }) => {
    try {
      const response = await fetch(`/api/movies?page=${page}&limit=${limit}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      throw error;
    }
  }
);

export const fetchMovie = createAsyncThunk("movies/fetchMovie", async (id) => {
  try {
    const response = await fetch(`/api/movies/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch movie:", error);
    throw error;
  }
});

export const addMovie = createAsyncThunk(
  "movies/addMovie",
  async (formData) => {
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        body: formData, // FormData will be automatically handled
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    } catch (error) {
      console.error("Failed to create movie:", error);
      throw error;
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    } catch (error) {
      console.error("Failed to update movie:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return id;
    } catch (error) {
      console.error("Failed to delete movie:", error);
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    currentMovie: null,
    status: "idle",
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalMovies: 0,
  },
  reducers: {
    clearMovies: (state) => {
      state.movies = [];
      state.currentMovie = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalMovies = 0;
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload.movies;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalMovies = action.payload.totalMovies;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch Single Movie
      .addCase(fetchMovie.pending, (state) => {
        state.status = "loading";
        state.currentMovie = null;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentMovie = action.payload;
        state.error = null;
      })
      .addCase(fetchMovie.rejected, (state, action) => {
        state.status = "failed";
        state.currentMovie = null;
        state.error = action.error.message;
      })

      // Add Movie
      .addCase(addMovie.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies.unshift(action.payload);
        state.totalMovies += 1;
        state.error = null;
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Update Movie
      .addCase(updateMovie.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.movies.findIndex(
          (movie) => movie.id === action.payload.id
        );
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        state.currentMovie = action.payload;
        state.error = null;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Movie
      .addCase(deleteMovie.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = state.movies.filter(
          (movie) => movie.id !== action.payload
        );
        state.totalMovies -= 1;
        state.error = null;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearMovies, clearCurrentMovie, setCurrentPage } =
  movieSlice.actions;
export default movieSlice.reducer;
