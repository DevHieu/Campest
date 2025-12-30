import { createContext, useContext, useEffect, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import { getUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!cookies.token) {
        setUser(null);
        setUserLoading(false);
        return;
      }

      try {
        const res = await getUser();
        setUser(res.data);
      } catch (error) {
        logout(); // chỉ logout khi API fail
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [cookies.token]);

  const logout = () => {
    setUser(null);
    removeCookie("token", { path: "/" });
  };

  return (
    <CookiesProvider>
      <AuthContext.Provider value={{ user, userLoading, logout, cookies }}>
        {children}
      </AuthContext.Provider>
    </CookiesProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
