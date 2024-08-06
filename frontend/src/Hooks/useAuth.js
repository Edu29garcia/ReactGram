import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user } = useSelector((state) => state.auth);

  const [auth, setAuth] = false;
  const [loading, setLoading] = true;

  useEffect(() => {
    if (user) {
      setAuth(true);
    } else {
      setAuth(false);
    }
    setLoading(false);
  }, [user]);

  return { auth, loading };
};
