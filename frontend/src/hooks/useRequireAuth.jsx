import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

export default function useRequireAuth() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const requireAuth = (callback) => {
    if (!user) {
      setOpen(true);
      return;
    }
    callback();
  };

  return { requireAuth, open, close: () => setOpen(false), user };
}
