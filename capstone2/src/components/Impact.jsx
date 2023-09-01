import { React, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Colors } from "chart.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../css/metrics.css";
Chart.register(Colors);
const myMap = new Map();
let arr = [];
const Impact = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [codebaseChanges, setCodebaseChanges] = useState();
  const [totalChanges, setTotalChanges] = useState(0);
  const [totalAdditions, setTotalAdditions] = useState(0);
  const [totalDeletions, setTotalDeletions] = useState(0);
  const [display, setDisplay] = useState(false);

  async function fetchData() {
    myMap.clear();
    arr.length = 0;
    let changeSum = 0,
      additionSum = 0,
      deletionSum = 0;
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}api/github/impact`,
      {
        owner: owner,
        repo: repo,
      }
    );
    result.data[0].forEach((ele) => {
      changeSum += ele.stats.total;
      additionSum += ele.stats.additions;
      deletionSum += ele.stats.deletions;
      ele.files.forEach((file) => {
        if (file.changes !== 0) {
          if (myMap.has(file.filename)) {
            myMap.set(file.filename, myMap.get(file.filename) + file.changes);
          } else {
            myMap.set(file.filename, file.changes);
          }
        }
      });
    });
    arr = Array.from(myMap);
    setTotalChanges(changeSum);
    setTotalAdditions(additionSum);
    setTotalDeletions(deletionSum);
    setCodebaseChanges(result.data[0]);
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
      fetchData();
    }
  }, [link, owner, repo]);

  return (
    <div>
      {display ? (
        <>
          <div
            style={{ width: "280px", height: "280px" }}
            className="small-pie-chart"
          >
            <Doughnut
              data={{
                labels: ["Additons", "Deletions"],
                datasets: [
                  {
                    label: "Lines of code",
                    data: [totalAdditions, totalDeletions],
                    backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
                    hoverOffset: 4,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: `${totalChanges} Lines changed`,
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
              }}
            />
          </div>
          <div style={{ width: 400 }} className="small-pie-chart">
            <Doughnut
              data={{
                labels: arr.map((ele) => ele[0]),
                datasets: [
                  {
                    label: "Line of code edit",
                    data: arr.map((ele) => ele[1]),
                    hoverOffset: 4,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Files Affected",
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
                title: {
                  display: true,
                  color: "white",
                  text: `${arr.length} Files Affected`,
                },
              }}
            />
          </div>
        </>
      ) : (
        <h1>Loading.....</h1>
      )}
    </div>
  );
};

export default Impact;
