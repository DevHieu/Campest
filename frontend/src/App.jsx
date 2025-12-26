import { AuthProvider } from "./context/AuthProvider";
import { useLocation } from "react-router-dom";
import { store } from "./store";
import "./App.css";

import Navbar from "./layouts/Navbar/Navbar";
import Footer from "./layouts/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";

function App() {
  const location = useLocation();

  const hideFooter =
    location.pathname.startsWith("/schedule/trip/") ||
    location.pathname.startsWith("/campsite");

  return (
    <Provider store={store}>
      <AuthProvider>
        <Navbar />
        <div className="center">
          <AppRoutes />
        </div>
        {!hideFooter && <Footer />}
      </AuthProvider>
    </Provider>
  );
}

export default App;
