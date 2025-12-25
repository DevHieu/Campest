import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Login from "../pages/LoginPage";
import SignUp from "../pages/SignUpPage";
import SurvivalPage from "../pages/SurvivalPage";
import SurvivalPost from "../pages/SurvivalPage/SurvivalPost";
import SchedulePage from "../pages/SchedulePage";
import TripPage from "../pages/SchedulePage/TripPage";
import CampsitePage from "../pages/CampsitePage";
import CampToolPage from "../pages/CampToolPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/survival" element={<SurvivalPage />} />
      <Route path="/survival/post" element={<SurvivalPost />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/schedule/trip/:id" element={<TripPage />} />
      <Route path="/campsite" element={<CampsitePage />} />
      <Route path="/tools" element={<CampToolPage />} />
    </Routes>
  );
};

export default AppRoutes;
