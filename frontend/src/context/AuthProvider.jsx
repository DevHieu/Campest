import { createContext, useContext, useEffect, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (cookies.token != undefined) {
      const options = {
        headers: { Authorization: `Bearer ${cookies.token}` },
        withCredentials: true,
      };
      axios
        .get(import.meta.env.VITE_BACKEND_API + "/get-user", options)
        .then((response) => {
          console.log(response.data);
          setUser(response.data.data);
          setUserLoading(false);
        })
        .catch((error) => {
          logout();
        });
    }
    setUserLoading(false);
  }, [cookies.token]);

  const logout = () => {
    setUser(null);
    removeCookie("token", { path: "/" });
    navigateTo("/login");
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
