import { React, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Colors } from "chart.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../css/metrics.css";
Chart.register(Colors);

const myMap = new Map();
let arr = [];

const Rework = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [fetchData, setFetchedData] = useState([]);
  const [display, setDisplay] = useState(false);

  function initializeMap() {
    const today = new Date();
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    while (threeWeeksAgo <= today) {
      const currentDate = threeWeeksAgo.toISOString().split("T")[0];
      myMap.set(currentDate, 0);
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() + 1);
    }
  }

  async function fetchReworkData() {
    myMap.clear();
    arr.length = 0;
    initializeMap();

    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}api/github/rework`,
      {
        owner: owner,
        repo: repo,
      }
    );

    //filter the dataset by date
    result.data.forEach((ele) => {
      let reworkCodeSum = 0;

      if (ele) {
        for (let file of ele.files) {
          reworkCodeSum += file.changes;
        }

        if (myMap.has(ele.date)) {
          myMap.set(ele.date, myMap.get(ele.date) + reworkCodeSum);
        } else {
          myMap.set(ele.date, reworkCodeSum);
        }
      }
    });

    arr = Array.from(myMap);
    setFetchedData(result.data);
    setDisplay(true);
  }

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }
    deconstructLink();
    if (owner && repo) {
      fetchReworkData();
    }
  }, [link, owner, repo]);

  return (
    <div className="avg-time-to-merge">
      <div className="pie-chart loading-div">
        {display ? (
          <div>
            <div style={{ width: 600 }}>
              <Line
                data={{
                  labels: arr.map((ele) => ele[0]),
                  datasets: [
                    {
                      label: "Rework Code",
                      data: arr.map((ele) => ele[1]),
                      borderColor: "rgb(187, 127, 255)",
                      backgroundColor: "rgb(244, 234, 255)",
                      pointRadius: 5,
                      pointHoverRadius: 14,
                      tension: 0.1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      text: ["Reworked Code", "From 3 Weeks Ago and Onwards"],
                      display: true,
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
                      fontColor: "white",
                      position: "bottom",
                      labels: {
                        color: "white", // Set the legend label color to white
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
                      text: "Value",
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
            </div>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default Rework;
