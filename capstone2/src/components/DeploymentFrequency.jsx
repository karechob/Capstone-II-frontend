import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";

function DeploymentFrequency() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [totalDeployments, setTotalDeployments] = useState(0);
  const [lastDeploymentTime, setLastDeploymentTime] = useState("");
  const [monthlyDeployments, setMonthlyDeployments] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }

    async function fetchDeploymentFrequency(owner, repo) {
      console.log("fetching deployments");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}api/github/deploymentFrequency?owner=${owner}&repo=${repo}`
        );

        const data = response.data;
        console.log("data", data);
        setTotalDeployments(data.totalDeployments);
        setLastDeploymentTime(data.lastDeploymentTime);
        setMonthlyDeployments(data.deploymentsByMonth);

        const formattedLastDeploymentTime = new Date(
          lastDeploymentTime
        ).toLocaleString();

        console.log("deployments", formattedLastDeploymentTime);
        console.log("whats here", data);
      } catch (error) {
        console.log("error in fetching deployment frequency " + error);
      }
    }

    deconstructLink();
    if (owner && repo) {
      fetchDeploymentFrequency(owner, repo);
    }
  }, [link, owner, repo]);

  //Line chart displaying the number of deployments per month
  const xAxisLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyDeploymentCounts = xAxisLabels.map((month) =>
    monthlyDeployments[month] ? monthlyDeployments[month].count : 0
  );
  const chartData = {
    labels: xAxisLabels,
    datasets: [
      {
        label: "Deployment Count",
        data: monthlyDeploymentCounts,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  //one bar graph displaying the deployment frequency per month
  const monthlyDeploymentFrequencies = xAxisLabels.map((month) =>
    monthlyDeployments[month]
      ? yourFrequency(
          monthlyDeployments[month].count,
          monthlyDeployments[month].weeks.length
        )
      : 0
  );
  const barChartData = {
    labels: xAxisLabels,
    datasets: [
      {
        label: "Deployment Frequency",
        data: monthlyDeploymentFrequencies,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1, // Border width
      },
    ],
  };
  const barChartOptions = {
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
        },
      },
    },
  };

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          stepSize: 5, // Step size for y-axis ticks
        },
      },
    },
  };

  const weekNumbers = [1, 2, 3, 4];

  // Extract deployment counts for each week
  const weeklyDeploymentCounts = xAxisLabels.map((month) => {
    return weekNumbers.map((weekNumber) => {
      const weekData = monthlyDeployments[month]?.weeks.find(
        (week) => week.weekNumber === weekNumber
      );
      return weekData ? weekData.count : 0;
    });
  });

  function yourFrequency(count) {
    return count / 4; // Default value if weekNumber is not 1-4
  }

  return (
    <div className="avg-time-to-merge">
      <h1 className="deployment-title">Deployment Frequency</h1>
      <div>
        <p>Total Deployments: {totalDeployments}</p>
        <p>Last Deployment Time: {lastDeploymentTime}</p>
        <div style={{ width: 600 }}>
          {/* <Line data={chartData} options={chartOptions} /> */}
          <Bar data={barChartData} options={barChartOptions} />
          {/* {monthlyDeployments && (
            <div>
              {Object.entries(monthlyDeployments).map(([month, { count, weeks }]) => (
                <div key={month}>
                  <h3>{month}</h3>
                  <p>Deployment Count: {count}</p>
                  {weeks.map(weekObj => (
                    <div key={weekObj.weekNumber}>
                      <p>Week {weekObj.weekNumber}: {weekObj.date}</p>
                    </div>
                  ))}
                  <p>Overall Frequency for {month}: {yourFrequency(count, weeks.length)}</p>
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default DeploymentFrequency;
