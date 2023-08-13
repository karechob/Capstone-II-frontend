import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Impact = () =>{
    const [codebaseChanges,setCodebaseChanges] = useState();

    async function fetchData(ownerOfRepo,repoName){
        const result = await axios.post('http://localhost:8080/api/github/impact',{
            owner: ownerOfRepo,
            repo: repoName
        })
        setCodebaseChanges(result.data);
    }
    useEffect(() =>{
        fetchData("karechob","Capstone-II-frontend");
    },[])
    return(
        <div>
            <h1>Hi this is impact mertic</h1>Hi this is impact mertic
            {codebaseChanges?(console.log(codebaseChanges)):(<h1>Loading.....</h1>)}
        </div>
    );
}

export default Impact;