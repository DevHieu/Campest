import { createContext, useContext, useEffect, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (cookies.token != undefined) {
      console.log(cookies.token);
      const options = {
        headers: { Authorization: `Bearer ${cookies.token}` },
      };
      axios
        .get(import.meta.env.VITE_BACKEND_API + "/get-user", options)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          logout();
        });
    }
  }, [cookies]);

  const logout = () => {
    setUser(null);
    removeCookie("token", { path: "/" });
  };

  return (
    <CookiesProvider>
      <AuthContext.Provider value={{ user, logout }}>
        {children}
      </AuthContext.Provider>
    </CookiesProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
