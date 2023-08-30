import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

function LinkPage() {
  const [link, setLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleLink(event) {
    setLink(event.target.value);
    setErrorMessage("");
  }

  function handleAnalyze() {
    // Check if the input is empty
    if (!link.trim()) {
      setErrorMessage("Please enter a repo link");
      return;
    }
    //validate github repo structure
    const matches = link.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!matches) {
      setErrorMessage("Invalid repo link");
      return;
    }

    navigate(`/metrics?link=${encodeURIComponent(link)}`);
  }

  return (
    <div className="search-bar">
      <input
        id="enter-link"
        type="text"
        value={link}
        onChange={handleLink}
        placeholder="Enter GitHub repository link"
      />
      <button onClick={handleAnalyze}>Analyze Metrics</button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default LinkPage;
