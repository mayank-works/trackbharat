import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import TrainSearchPage from "../pages/TrainSearchPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage status="healthy" />} />
        <Route path="/trains" element={<TrainSearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;