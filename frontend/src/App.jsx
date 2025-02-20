import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/schedule" element={<SchedulePage />}></Route>
      </Routes>
    </>
  );
}

export default App;
