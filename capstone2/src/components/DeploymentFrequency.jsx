import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import '../css/metrics.css';

function DeploymentFrequency() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [totalDeployments, setTotalDeployments] = useState(0);
  const [lastDeploymentTime, setLastDeploymentTime] = useState("");
  const [deploymentData, setDeploymentData] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }

    async function fetchDeploymentFrequency(owner, repo) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}api/github/deploymentFrequency`,
          {
            params: {
              owner: owner,
              repo: repo,
            },
          }
        );

        const data = response.data;
        setTotalDeployments(data.totalDeployments);
        setLastDeploymentTime(data.lastDeploymentTime);
        setDeploymentData(data.deploymentData);
      } catch (error) {
        console.log("error in fetching deployment frequency " + error);
      }
    }

    deconstructLink();
    if (owner && repo) {
      fetchDeploymentFrequency(owner, repo);
    }
  }, [link, owner, repo]);

  const chartData = {
    labels: deploymentData.map(item => item.date),
    datasets: [
      {
        label: "Deployment Frequency",
        data: deploymentData.map(item => item.frequency),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };
  

  return (
    <div className="avg-time-to-merge">
      <h1>Deployment Frequency</h1>
      
     
        <div>
          <p>Total Deployments: {totalDeployments}</p>
          <p>Last Deployment Time: {lastDeploymentTime}</p>
          
          <div style={{ width: 600 }}>
            <Line data={chartData} />
          </div>
        </div>
    
    </div>
  );
}

export default DeploymentFrequency;
