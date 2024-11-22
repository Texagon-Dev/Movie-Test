"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { setSession, setIsLoading } from "@/redux/features/userSlice";

export function SessionProvider({ children }) {
  const dispatch = useDispatch();
  const supabase = createClientComponentClient();

  useEffect(() => {
    dispatch(setIsLoading(true));

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
      dispatch(setIsLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, supabase]);

  return children;
}
