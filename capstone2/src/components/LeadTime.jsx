import axios from "axios";
import { React, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useLocation } from "react-router-dom";
import "../css/metrics.css";

Chart.register(CategoryScale);

const LeadTime = () => {
  const [leadTime, setLeadTimeState] = useState();
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  const fetchLeadTimeDate = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/github/leadTime?owner=${owner}&repo=${repo}`
    );
    // console.log(result.data.commit_data);
    setLeadTimeState(result.data);
  };

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }
    deconstructLink();
    if (owner && repo) {
      fetchLeadTimeDate();
    }
  }, [link, owner, repo]);

  return (
    <div className="avg-time-to-merge">
      <center>
        <div
          className="loading-div"
          style={{
            width: "100%",
          }}
        >
          {leadTime === undefined ? (
            <h1>Loading...</h1>
          ) : (
            <Line
              data={{
                labels: leadTime.commit_data.map((elements) => {
                  return elements.date;
                }),
                datasets: [
                  {
                    label: "Number of Commits in the Repository",
                    data: leadTime.commit_data.map((elements) => {
                      return elements.data.length;
                    }),
                    borderColor: "rgb(255, 55, 55)",
                    backgroundColor: "rgb(255, 218, 218)",
                    // pointStyle: "rectRounded",
                    pointRadius: 5,
                    pointHoverRadius: 14,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Lead Time for Changes",
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
                    position: "bottom",
                    labels: {
                      color: "white",
                    },
                  },
                },
                scales: {
                  x: {
                    display: true,
                    text: "Day",
                    font: {
                      family: "Poppins",
                      size: 20,
                      style: "normal",
                      lineHeight: 1.2,
                    },
                    ticks: {
                      color: "white",
                    },
                  },
                  y: {
                    display: true,
                    text: "Day",
                    font: {
                      family: "Poppins",
                      size: 20,
                      style: "normal",
                      lineHeight: 1.2,
                    },
                    ticks: {
                      color: "white",
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </center>
    </div>
  );
};

export default LeadTime;
