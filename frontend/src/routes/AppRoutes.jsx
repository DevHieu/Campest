import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";

import HomePage from "../pages/HomePage";
import Login from "../pages/LoginPage";
import SignUp from "../pages/SignUpPage";
import SurvivalPage from "../pages/SurvivalPage";
import SurvivalPost from "../pages/SurvivalPage/SurvivalPost";
import SchedulePage from "../pages/SchedulePage";
import TripPage from "../pages/SchedulePage/TripPage";
import CampsitePage from "../pages/CampsitePage";
import CampToolPage from "../pages/CampToolPage";
import OAuth2Redirect from "../pages/Oauth2/OAuth2Redirect";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/schedule/trip/:id" element={<TripPage />} />
      </Route>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/survival" element={<SurvivalPage />} />
      <Route path="/survival/post" element={<SurvivalPost />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/campsite" element={<CampsitePage />} />
      <Route path="/tools" element={<CampToolPage />} />
      <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
    </Routes>
  );
};

export default AppRoutes;
