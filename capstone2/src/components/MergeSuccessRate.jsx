import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function MergeSuccessRate() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const link = searchParams.get("link");
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [mergeSuccessRate, setMergeSuccessRate] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function deconstructLink() {
          let tokens = link.split("/");
          setOwner(tokens[3]);
          setRepo(tokens[4]);
        }

        async function getMergeSuccessRate(owner, repo) {
            try {
                const response = await axios.get(`http://localhost:8080/api/github/mergeSuccessRate`, {
                    params: {
                      owner: owner,
                      repo: repo,
                    },
                  });
                setMergeSuccessRate(response.data.mergeSuccessRate);
            } catch (error) {
                console.log(error);
            }
        }

    deconstructLink();
    if (owner && repo) {
      getMergeSuccessRate(owner, repo);
    }
    }, [link, owner, repo]);

  return ( 
      <div>
          {loading && <div>Loading...</div>}
          {mergeSuccessRate !== null && (
        <div>
            {mergeSuccessRate}
        </div>
      )}
      </div>
  )
}

export default MergeSuccessRate