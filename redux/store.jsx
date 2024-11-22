import { configureStore } from "@reduxjs/toolkit";

import movieReducer from "./features/movieSlice";
import userReducer from "./features/userSlice";

export const createStore = () => {
  return configureStore({
    reducer: {
      movies: movieReducer,
      user: userReducer,
    },
  });
};

export const store = createStore();
