"use client";
import AuthContext from "../lib/auth-context";
import useUser from "../lib/useUser";

export default function Auth({ children }: { children: React.ReactNode }) {
  const [user, setUser, token, setToken] = useUser();

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
