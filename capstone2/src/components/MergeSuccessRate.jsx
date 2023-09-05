import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "../css/metrics.css";

function MergeSuccessRate() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [mergeSuccessRate, setMergeSuccessRate] = useState(0);
  const [remainder, setRemainder] = useState(0);

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }

    async function getMergeSuccessRate(owner, repo) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}api/github/mergeSuccessRate`,
          {
            params: {
              owner: owner,
              repo: repo,
            },
          }
        );
        const successRate = response.data.mergeSuccessRate;
        setMergeSuccessRate(successRate);
        setRemainder(100.0 - successRate);
      } catch (error) {
        console.log(error);
      }
    }

    deconstructLink();
    if (owner && repo) {
      getMergeSuccessRate(owner, repo);
    }
  }, [link, owner, repo]);

  const data = {
    labels: ["Success Rate", "Remainder"],
    datasets: [
      {
        label: "Percentage",
        data: [mergeSuccessRate, remainder],
        backgroundColor: [
          "rgb(80, 200, 120)", //green
          "rgb(255,255,255)",
        ],
        hoverBackgroundColor: ["rgb(89, 224, 134)", "rgb(240,255,240)"],
        borderColor: ["rgb(255,250,240)"],
        borderWidth: [1],
        hoverOffset: 4,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    layout: {
      padding: 5,
    },
    plugins: {
      title: {
        display: true,
        text: "Merge Success Rate",
        align: "center",
        color: "white",
        font: {
          family: "Poppins",
          size: 30,
          style: "normal",
          lineHeight: 1.6,
        },
      },
      Tooltip: {
        enabled: true,
      },
      legend: {
        display: true,
        fontColor: "white",
        position: "bottom",
        labels: {
          color: "#ffffff",
        },
      },
    },
  };

  return (
    <div className="thorough-prs loading-div">
      {mergeSuccessRate === "" ? (
        <h1>Loading...</h1>
      ) : (
        <div style={{ width: "320px", height: "320px" }}>
          <Doughnut data={data} options={config} />
        </div>
      )}
    </div>
  );
}

export default MergeSuccessRate;
