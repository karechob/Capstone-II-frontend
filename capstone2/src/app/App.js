import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LinkPage from "../pages/LinkPage";
import Metrics from "../pages/Metrics";
import Impact from "../components/Impact"

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/link" element={<LinkPage />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/impact" element={<Impact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
