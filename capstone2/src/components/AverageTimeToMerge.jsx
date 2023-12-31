import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "../css/metrics.css";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AverageTimeToMerge = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [avgTimeToMerge, setAvgTimeToMerge] = useState(null);
  const [loading, setLoading] = useState(false);

  const getChartData = (avgTime) => {
    return {
      labels: ["Average Merge Time"],
      datasets: [
        {
          label: "Hours",
          data: [avgTime],
          backgroundColor:
            avgTime <= 24 ? "#66ff66" : avgTime <= 168 ? "#FFFF00" : "#FF6347",
          borderColor: "#333",
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }

    async function fetchPullRequests(owner, repo) {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}api/github/avgTimeToMerge`,
          {
            params: {
              owner: owner,
              repo: repo,
            },
          }
        );
        console.log("Received API response:", response.data);

        const avgTime = response.data.avgTime;
        setAvgTimeToMerge(avgTime);
      } catch (error) {
        console.log("error in fetching pull requests " + error);
      } finally {
        setLoading(false);
      }
    }

    deconstructLink();
    if (owner && repo) {
      fetchPullRequests(owner, repo);
    }
  }, [link, owner, repo]);

  return (
    <div className="avg-time-to-merge">
      {loading && <h1 className="loading-div">Loading...</h1>}
      {avgTimeToMerge !== null && (
        <div>
          <Bar
            data={getChartData(avgTimeToMerge)}
            options={{
              responsive: true,
              layout: {
                padding: 5,
                legend: {
                  position: "bottom", // Move the legend to the bottom
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: "Average Merge Time",
                  align: "center",
                  color: "white",
                  font: {
                    family: "Poppins",
                    size: 30,
                    style: "normal",
                    lineHeight: 1.6,
                  },
                },
                legend: {
                  display: true,
                  position: "bottom", // Move the legend to the bottom
                  labels: {
                    color: "white",
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "white",
                  },
                },
                y: {
                  beginAtZero: true,
                  suggestedMax: 24,
                  ticks: {
                    color: "white",
                  },
                },
              },
              tooltips: {
                enabled: false,
              },
            }}
          />
          {/* <div className="average-time">
            Average Time to Merge: {avgTimeToMerge.toFixed(2)} hours
          </div> */}
        </div>
      )}
    </div>
  );
};

export default AverageTimeToMerge;
