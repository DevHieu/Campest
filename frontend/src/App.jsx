import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import "./App.css";

import Navbar from "./layouts/Navbar/Navbar";
import Footer from "./layouts/Footer/Footer";

import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import SurvivalPage from "./pages/SurvivalPage";
import SurvivalPost from "./pages/SurvivalPage/SurvivalPost";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="center">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/schedule" element={<SchedulePage />}></Route>
          <Route path="/survival" element={<SurvivalPage />}></Route>
          <Route path="/survival/post" element={<SurvivalPost />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;
