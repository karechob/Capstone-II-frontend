import React from "react";
import ThoroughPR from "../components/ThoroughPR";
import Impact from "../components/Impact";
import UnreviewedPR from "../components/UnreviewedPR";
import AverageTimeToMerge from "../components/AverageTimeToMerge";
import NewWork from "../components/NewWork";
import Responsiveness from "../components/Responsiveness";
import MergeSuccessRate from "../components/MergeSuccessRate";
import Rework from "../components/Rework";
import LeadTime from "../components/LeadTime";
import DeploymentFrequency from "../components/DeploymentFrequency";
import { useNavigate } from "react-router-dom";
import "../css/metrics.css";

function Metrics() {
  const navigate = useNavigate();

  function handleAnalyze() {
    navigate(`/`);
  }

  return (
    <div className="metrics-page">
      <div className="metrics-btn">
        <button onClick={handleAnalyze}>Back To Home Page</button>
      </div>
      <div className="metrics-title-container">
        <h1>Analyzed Result</h1>
      </div>
      <div className="metrics-container">
        <div className="chart-pair-container">
          <div className="averageTimeToMerge">
            <LeadTime />
          </div>
          <div className="averageTimeToMerge">
            <Rework />
          </div>
        </div>
        <div className="chart-pair-container">
          <div className="averageTimeToMerge">
            <DeploymentFrequency />
          </div>
          <div className="averageTimeToMerge">
            <NewWork />
          </div>
        </div>
        <div className="chart-pair-container">
          <div className="small-pie-chart">
            <ThoroughPR />
          </div>
          <div className="small-pie-chart">
            <UnreviewedPR />
          </div>
          <div className="small-pie-chart">
            <MergeSuccessRate />
          </div>
          <Impact />
        </div>
        <div className="chart-pair-container">
          <div className="averageTimeToMerge">
            <Responsiveness />
          </div>
          <div className="averageTimeToMerge">
            <AverageTimeToMerge />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metrics;
