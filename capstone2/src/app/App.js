import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LinkPage from "../pages/LinkPage";
import Metrics from "../pages/Metrics";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/link" element={<LinkPage />} />
          <Route path="/metrics" element={<Metrics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
