import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PrivateRoutes = () => {
  const { cookies } = useAuth();
  return cookies.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
