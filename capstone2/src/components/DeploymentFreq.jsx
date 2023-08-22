import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

import React, { useState, useEffect } from "react";
import axios from "axios";

function DeploymentFrequency() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [deploymentFrequency, setDeploymentFrequency] = useState(0);

  useEffect(() => {
    async function fetchDeploymentFrequency() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/github/generatePull`,
          {
            params: {
              owner: owner,
              repo: repo,
            },
          }
        );
        const { success, failure } = response.data;
        const totalPulls = success + failure;
        const frequency = totalPulls > 0 ? success / totalPulls : 0;
        setDeploymentFrequency(frequency);
      } catch (error) {
        console.log("Error fetching deployment frequency: ", error);
      }
    }

    setOwner("");
    setRepo("");

    fetchDeploymentFrequency();
  }, [owner, repo]);

  return (
    <div>
      <h1>Deployment Frequency</h1>
      <p>
        Owner: {owner}
        <br />
        Repo: {repo}
      </p>
      <p>
        Deployment Frequency:{" "}
        {deploymentFrequency.toLocaleString(undefined, {
          style: "percent",
          minimumFractionDigits: 2,
        })}
      </p>
    </div>
  );
}

export default DeploymentFrequency;
