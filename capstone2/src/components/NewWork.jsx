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
const NewWork = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [fetchData, setFetchedData] = useState([]);
  const [display, setDisplay] = useState(false);

  // initialize myMap by using a while loop to set the date as key and value to 0
  function initializeMap() {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    //will keep looping until the date is updated to the current date
    while (sevenDaysAgo <= today) {
      const currentDate = sevenDaysAgo.toISOString().split("T")[0];
      myMap.set(currentDate, 0);
      //increment the date by one day
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() + 1);
    }
  }

  async function fetchNewCodeData() {
    myMap.clear();
    arr.length = 0;
    initializeMap();
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}api/github/new_Work`,
      {
        owner: owner,
        repo: repo,
      }
    );
    //filter the dataset by date
    result.data.forEach((ele) => {
      //get the total number of lines of new code
      let totalNewCode = ele.stats.additions - ele.stats.deletions;
      if (totalNewCode < 0) {
        totalNewCode = 0;
      }
      if (myMap.has(ele.date)) {
        myMap.set(ele.date, myMap.get(ele.date) + totalNewCode);
      } else {
        myMap.set(ele.date, totalNewCode);
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
      fetchNewCodeData();
    }
  }, [link, owner, repo]);

  return (
    <div className="avg-time-to-merge loading-div">
      {display ? (
        <div>
          <div style={{ width: 600 }}>
            <Line
              data={{
                labels: arr.map((ele) => ele[0]),
                datasets: [
                  {
                    label: "Total Lines of New Code",
                    data: arr.map((ele) => ele[1]),
                    borderColor: "rgb(255, 202, 77)",
                    backgroundColor: "rgb(255, 248, 230)",
                    pointRadius: 5,
                    pointHoverRadius: 14,
                    tension: 0.1,
                  },
                ],
              }}
              options={{
                plugins: {
                  layout: {
                    padding: 5,
                  },
                  title: {
                    display: true,
                    text: [
                      "Lines of New Code",
                      "Added Per Day (From 7 Days Ago)",
                    ],
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
                scales: {
                  x: {
                    ticks: {
                      color: "white",
                    },
                  },
                  y: {
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
  );
};

export default NewWork;
