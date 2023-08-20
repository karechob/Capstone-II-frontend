import { React, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Colors} from "chart.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
Chart.register(Colors);

const NewWork = () => {
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const link = searchParams.get("link");

    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [fetchData, setFetchedData] = useState([]);
    const [display,setDisplay] = useState(false);

    async function fetchNewCodeData(){
        let changeSum = 0, additionSum = 0, deletionSum = 0;
        const result = await axios.post('http://localhost:8080/api/github/new_Work',{
            owner: owner,
            repo: repo
        })
        result.data.forEach((ele)=>{
            changeSum += ele.stats.total;
            additionSum += ele.stats.additions;
            deletionSum += ele.stats.deletions;
        })
        setFetchedData(result.data);
        setDisplay(true);
    }

    useEffect(() =>{
        function deconstructLink() {
            let tokens = link.split("/");
            setOwner(tokens[3]);
            setRepo(tokens[4]);
        }
        deconstructLink();
        if (owner && repo) {
            fetchNewCodeData();
        }
    },[link, owner, repo])

    return(
        <div>
            {display?(
            <div>
                <h1>data fetched</h1>
            </div>):(<h1>Loading.....</h1>)}
        </div>
    )
}

export default NewWork;