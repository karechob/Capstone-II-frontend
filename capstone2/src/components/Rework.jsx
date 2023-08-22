import { React, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Colors } from "chart.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
Chart.register(Colors);

const myMap = new Map();
let arr = [];
let totalReworkCodeSum = 0;

const Rework = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [fetchData, setFetchedData] = useState([]);
  const [display, setDisplay] = useState(false);
  const [reworkPercent, setReworkPercent] = useState(0);

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
    let fileCount = 0;
    myMap.clear();
    arr.length = 0;
    initializeMap();

    const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/github/rework`, {
      owner: owner,
      repo: repo,
    });

    //filter the dataset by date
    result.data.forEach((ele) => {
      let reworkCodeSum = 0;

      if (ele) {
        console.log("element", ele);
        fileCount += ele.files.length;

        for (let file of ele.files) {
          reworkCodeSum += file.changes;
          totalReworkCodeSum += file.changes;
        }

        if (myMap.has(ele.date)) {
          myMap.set(ele.date, myMap.get(ele.date) + reworkCodeSum);
        } else {
          myMap.set(ele.date, reworkCodeSum);
        }
      }
    });

    setReworkPercent(Math.floor(totalReworkCodeSum / fileCount));
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
    <div className="rework-container">
      <div
        className="pie-chart"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
                      borderColor: "rgba(194, 140, 255)",
                      backgroundColor: "rgba(255, 255, 255)",
                      tension: 0.1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Reworked Code From 3 Weeks Ago and Onwards",
                    },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <h1>Loading.....</h1>
        )}
      </div>
      <div className="more-information">
        <h1>More Information</h1>
        <h2>Rework Percentage of Rework Code: {reworkPercent}%</h2>
      </div>
    </div>
  );
};

export default Rework;
