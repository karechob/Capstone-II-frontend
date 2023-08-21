import { React, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
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
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Responsiveness",
      },
    },
  };

  async function fetchData() {
    const result = await axios.get(
      "http://localhost:8080/api/github/responsiveness",
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
    <div>
      {display ? (
        <div style={{ width: 600 }}>
          <Bar
            options={options}
            data={{
              // x-axis
              labels: [
                "within half hour",
                "within one hour",
                "within three hour",
                "withinin half a day",
                "within one day",
                "within one week",
                "within one month",
                "no response",
              ],
              datasets: [
                {
                  //
                  label: "Total response",
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
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
              ],
            }}
          />
        </div>
      ) : (
        <h1>Loading.....</h1>
      )}
    </div>
  );
};

export default Responsiveness;
