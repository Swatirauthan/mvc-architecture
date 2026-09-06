import { useEffect, useMemo, useState } from "react";
import { api, getStoredToken, setStoredToken } from "../api/client";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [ready, setReady] = useState(() => !getStoredToken());

  useEffect(() => {
    if (!token) {
      return;
    }

    api
      .me()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        setStoredToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      isAuthenticated: Boolean(user),
      signIn(nextUser, nextToken) {
        setStoredToken(nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      signOut() {
        setStoredToken(null);
        setToken(null);
        setUser(null);
      },
    }),
    [user, token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
