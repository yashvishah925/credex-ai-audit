import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import FormPage from "./pages/FormPage";
import ResultsPage from "./pages/ResultsPage";
import SummaryPage from "./pages/SummaryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Form */}
        <Route path="/form" element={<FormPage />} />

        {/* Audit Engine Page */}
        <Route path="/audit" element={<ResultsPage />} />

        {/* Final Summary Page */}
        <Route path="/summary" element={<SummaryPage />} />

        {/* Shareable Public URL */}
        <Route path="/share/:shareId" element={<SummaryPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;