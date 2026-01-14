import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401) {
          if (isMounted) setUser(null);
          return;
        }

        if (!res.ok) {
          throw new Error("Auth check failed");
        }

        const data = await res.json();
        if (isMounted) setUser(data.user);
      })
      .catch((err) => {
        console.error("Auth bootstrap error:", err);
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
