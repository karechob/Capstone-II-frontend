import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

//Thoroughly reviewed PRS is the percentage of merged pull requests with at least one regular or robust comment. 

function ThoroughPR() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link");

  useEffect(() => {
    function deconstructLink() {
      let tokens = link.split("/");
      setOwner(tokens[3]);
      setRepo(tokens[4]);
    }

    deconstructLink();
  }, []);

  return (
    <div>
      <h1>Thorough PRs</h1>
      <p>Link: {link} </p>
      <p>Owner: {owner} </p>
      <p>Repo: {repo} </p>
    </div>
  );
}

export default ThoroughPR;
