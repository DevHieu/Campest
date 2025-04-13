import { AuthProvider } from "./context/AuthProvider";
import { useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./layouts/Navbar/Navbar";
import Footer from "./layouts/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  const hideFooter = location.pathname.startsWith("/schedule/trip/");

  return (
    <AuthProvider>
      <Navbar />
      <div className="center">
        <AppRoutes />
      </div>
      {!hideFooter && <Footer />}
    </AuthProvider>
  );
}

export default App;
