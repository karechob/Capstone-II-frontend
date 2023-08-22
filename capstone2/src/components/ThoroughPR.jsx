import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

function ThoroughPR() {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [percentage, setPercentage] = useState("");
  const [notThorough, setNotThorough] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  const data = {
    labels: ["ThoroughPRs", "Non-ThoroughPRs"],
    datasets: [
      {
        label: "Percent",
        data: [percentage, notThorough],
        backgroundColor: [
          'rgb(80, 200, 120)', //green
          'rgb(222, 49, 99)', //red
        ],
        hoverBackgroundColor: [
          'rgb(89, 224, 134)',
          'rgb(247, 54, 109)'
        ],
        borderColor: [
          'rgb(255,250,240)'
        ],
        borderWidth: [1],
        hoverOffset: 4,
      },
    ],
  };

  const config = {
    type: "pie",
    data: data,
  };

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }

    async function fetchPullRequests(owner, repo) { 
      console.log(owner)
      console.log(repo);
      
      try {
        const response = await axios.get(`https://localhost:8080/api/github/thoroughPRs`, {
          params: {
            owner: owner,
            repo: repo,
          },
        });

        const data = response.data;
        setPercentage(data.percentage)
        setNotThorough(data.notThorough)

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
      
      {/* <h1>Thorough PRs</h1>
      <h4>
        Thoroughly reviewed PRS is the percentage of merged pull requests with
        at least one comment. This metric helps you understand your team's code
        review quality. The higher the percentage, the better off you and your
        team are!
        <br></br>
        Please note our metric measures to the nearest whole number.
      </h4>
      <p>Link: {link} </p>
      <p>Owner: {owner} </p>
      <p>Repo: {repo} </p> */}

      {percentage === "" ? (
        <p>Percentage of Thorough PRs: Calculating... One Moment...</p>
      ) : (
        // <p>Percentage of Thorough PRs: {percentage}% </p>
        <div style={{ width: "400px", height: "400px" }}>
          <Pie data={data} options={config} />
        </div>
      )}

      

    </div>
  );
}

export default ThoroughPR;
