"use client";
import { Provider } from "react-redux";
import { store } from "../store";
import { SessionProvider } from "@/lib/SessionProvider";


export function Providers({ children }) {
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
}
