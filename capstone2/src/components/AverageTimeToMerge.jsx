import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const RepoSearch = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const link = searchParams.get("link");
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [avgTimeToMerge, setAvgTimeToMerge] = useState(null);
    const [loading, setLoading] = useState(false);

  const getChartData = (avgTime) => {
    return {
      labels: ['Average Merge Time'],
      datasets: [{
        label: 'Hours',
        data: [avgTime],
        backgroundColor: avgTime <= 24 ? '#66ff66' : (avgTime <= 168 ? '#FFFF00' : '#FF6347'),
        borderColor: '#333',
        borderWidth: 1
      }]
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
        const response = await axios.get(`http://localhost:8080/api/github/avgTimeToMerge`, {
          params: {
            owner: owner,
            repo: repo,
          },
        });
        console.log("Received API response:", response.data);

        const avgTime = response.data.avgTime;
        setAvgTimeToMerge(avgTime);

      } catch (error) {
        console.log("error in fetching pull requests " + error);
      }
    }

    deconstructLink();
    if (owner && repo) {
      fetchPullRequests(owner, repo);
    }
  }, [link, owner, repo]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {avgTimeToMerge !== null && (
        <div>
          <Bar
            data={getChartData(avgTimeToMerge)}
            options={{
              responsive: true,
              legend: {
                display: false,
              },
              scales: {
                y: {
                  beginAtZero: true,
                  suggestedMax: 24,
                },
              },
              tooltips: {
                enabled: false,
              },
            }}
          />
          <div className="average-time">
            Average Time to Merge: {avgTimeToMerge.toFixed(2)} hours
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoSearch;
