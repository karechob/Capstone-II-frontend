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
  const authToken = process.env.REACT_APP_GITHUB_API_KEY;

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

    async function fetchPullRequests() {
      try {
        if (owner && repo) {
          //console.log(owner);
          //console.log(repo);

          let allPullRequests = [];
          let page = 1;
          let hasMorePullRequests = true;

          while (hasMorePullRequests) {
            const response = await axios.get(
              `https://api.github.com/repos/${owner}/${repo}/pulls`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
                params: {
                  state: "closed",
                  base: "main",
                  page: page,
                  per_page: 100,
                },
              }
            );

            const pullRequests = response.data;
            allPullRequests = allPullRequests.concat(pullRequests);

            // Check if there are more pages
            if (pullRequests.length === 0) {
              hasMorePullRequests = false;
            } else {
              page++;
            }
          }

          let totalRequests = allPullRequests.length;
          let thoroughRequests = 0;
          //console.log(totalRequests + " total");

          for (const request of allPullRequests) {
            const commentsResponse = await axios.get(request.comments_url, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            const comments = commentsResponse.data;

            if (comments.length > 0) {
              thoroughRequests++;
            }
          }

          //console.log(thoroughRequests);
          setPercentage(Math.round((thoroughRequests / totalRequests) * 100));
          //console.log(percentage);
          setNotThorough(
            Math.round(
              ((totalRequests - thoroughRequests) / totalRequests) * 100
            )
          );
          //console.log(notThorough);
        }
      } catch (error) {
        console.log("error fetching pull requests " + error);
      }
    }

    deconstructLink();
    fetchPullRequests();
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
