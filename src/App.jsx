import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import FormPage from "./pages/FormPage";
import ResultsPage from "./pages/ResultsPage";
import SummaryPage from "./pages/SummaryPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/form" element={<FormPage />} />

        {/* AUDIT ENGINE PAGE */}
        <Route path="/audit" element={<ResultsPage />} />

        {/* FINAL RESULTS + SUMMARY */}
        <Route path="/results" element={<SummaryPage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;