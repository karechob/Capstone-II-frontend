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


function Metrics() {
  return (
    <div>
      <h1>Your Metrics</h1>
      <ThoroughPR></ThoroughPR>
      <Impact />
      <UnreviewedPR />
      <MergeSuccessRate />
      <AverageTimeToMerge />
      <NewWork />
      <Responsiveness />
      <Rework />
      <LeadTime />
    </div>
  );
}

export default Metrics;
