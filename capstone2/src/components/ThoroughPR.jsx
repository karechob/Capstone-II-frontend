import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

//Thoroughly reviewed PRS is the percentage of merged pull requests with at least one regular or robust comment. 

function ThoroughPR() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [percentage, setPercentage] = useState(""); 
  const authToken = process.env.REACT_APP_GITHUB_API_KEY; 

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }

    async function fetchPullRequests() {
        try {
          if (owner && repo) {
            console.log(owner);
            console.log(repo);

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
                    state: 'closed',
                    page: page,
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
            console.log(totalRequests);
      
            for (const request of allPullRequests) {
              const commentsResponse = await axios.get(request.comments_url, {
                headers:  {
                    Authorization: `Bearer ${authToken}`,
                }
            });
              const comments = commentsResponse.data;
      
              if (comments.length > 0) {
                thoroughRequests++;
              }
            }
      
            console.log(thoroughRequests);
            setPercentage(Math.round((thoroughRequests / totalRequests) * 100));
            console.log(percentage);
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
      <h1>Thorough PRs</h1>
      <p>Link: {link} </p>
      <p>Owner: {owner} </p>
      <p>Repo: {repo} </p>
      <p>Percentage of Thorough PRs to Nearest Whole: {percentage}% </p>
    </div>
  );
}

export default ThoroughPR;
