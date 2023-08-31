import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import '../css/metrics.css';

function UnreviewedPR() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [success, setSuccess] = useState(0);
  const [failure, setFailure] = useState(0);

  const data = {
    labels: ["Reviewed pull requests", "Unreviewed pull requests"],
    datasets: [
      {
        label: "Count",
        data: [success, failure],
        backgroundColor: [
          "rgb(80, 200, 120)", //green
          "rgb(222, 49, 99)", //red
        ],
        hoverBackgroundColor: ["rgb(89, 224, 134)", "rgb(247, 54, 109)"],
        borderColor: ["rgb(255,250,240)"],
        borderWidth: [1],
        hoverOffset: 4,
      },
    ],
  };

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }
    async function fetchPullRequests() {
      if ((owner, repo)) {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}api/github/generatePull`,
          {
            params: {
              owner,
              repo,
            },
          }
        );
        if (response.status === 200) {
          const data = response.data;
          setSuccess(data.success);
          setFailure(data.failure);
        }
      }
    }
    deconstructLink();
    fetchPullRequests();
  }, [link, owner, repo]);

  const config = {
    type: "pie",
    data: data,
    layout: {
      padding: 5,
    },
    plugins: {
      title: {
        display: true,
        text: 'Unreviewed PRs',
        align : 'center',
        color: "white",
        font: {
            family: "Poppins",
            size: 30,
            style: "normal",
            lineHeight: 1.6,
        }
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
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          // flexDirection: "column",
          // alignItems: "center",
        
        }}
      >
        {success === 0 && failure === 0 ? (
          <h1>Loading...</h1>
        ) : (
          <div style={{ width: "300px", height: "300px" }}>
            <Pie data={data} options={config} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UnreviewedPR;
