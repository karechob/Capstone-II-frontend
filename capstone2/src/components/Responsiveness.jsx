import { React, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "../css/metrics.css";
import {
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
Chart.register(
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Responsiveness = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [display, setDisplay] = useState(false);
  const [chartData, setChartData] = useState({
    halfAnHour: 0,
    anHour: 0,
    threeHours: 0,
    halfADay: 0,
    aDay: 0,
    aWeek: 0,
    oneMonth: 0,
    notResponding: 0,
  });
  const options = {
    responsive: true,
    plugins: {
      layout: {
        padding: 5,
      },
      legend: {
        display: true,
        fontColor: "white",
        position: "bottom",
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: "Response Time to Comments",
        align: "center",
        color: "white",
        font: {
          family: "Poppins",
          size: 30,
          style: "normal",
          lineHeight: 1.6,
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
  };

  async function fetchData() {
    const result = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/github/responsiveness`,
      {
        params: {
          owner: owner,
          repo: repo,
        },
      }
    );
    for (const k in result.data) {
      if (Object.hasOwnProperty.call(result.data, k)) {
        const item = result.data[k];
        chartData[k] = item;
      }
    }
    setChartData(chartData);
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
    <div className="avg-time-to-merge loading-div">
      {display ? (
        <div style={{ width: 600 }}>
          <Bar
            options={options}
            data={{
              // x-axis
              labels: [
                "Within half an hour",
                "Within one hour",
                "Within three hours",
                "Within half a day",
                "Within one day",
                "Within one week",
                "Within one month",
                "No response",
              ],
              datasets: [
                {
                  label: "Count",
                  // y-axis
                  data: [
                    chartData.halfAnHour,
                    chartData.anHour,
                    chartData.threeHours,
                    chartData.halfADay,
                    chartData.aDay,
                    chartData.aWeek,
                    chartData.oneMonth,
                    chartData.notResponding,
                  ],
                  // borderColor: "rgba(255, 255, 255, 1)",
                  backgroundColor: "rgb(255, 99, 132)",
                },
              ],
            }}
          />
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default Responsiveness;
