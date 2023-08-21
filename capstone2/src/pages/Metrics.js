import React from "react";
import ThoroughPR from "../components/ThoroughPR";
import Impact from "../components/Impact";
import UnreviewedPR from "../components/UnreviewedPR";
import RepoSearch from "../components/AverageTimeToMerge";

function Metrics() {
  return (
    <div>
      <h1>Your Metrics</h1>
      <ThoroughPR></ThoroughPR>
      <Impact />
      <UnreviewedPR />
      <RepoSearch />
    </div>
  );
}

export default Metrics;