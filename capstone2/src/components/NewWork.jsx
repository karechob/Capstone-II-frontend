import { React, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Colors} from "chart.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
Chart.register(Colors);

const myMap = new Map();
let arr = [];
const NewWork = () => {
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const link = searchParams.get("link");

    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [fetchData, setFetchedData] = useState([]);
    const [display,setDisplay] = useState(false);

    // initialize myMap by using a while loop to set the date as key and value to 0
    function initializeMap(){
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); 

        while (sevenDaysAgo <= today) {
            const currentDate = sevenDaysAgo.toISOString().split('T')[0];
            console.log(currentDate)
            myMap.set(currentDate, 0);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() + 1); 
        }
    }

    async function fetchNewCodeData(){
        myMap.clear();
        arr.length = 0;
        initializeMap();
        const result = await axios.post('http://localhost:8080/api/github/new_Work',{
            owner: owner,
            repo: repo
        })
        result.data.forEach((ele)=>{
            if(myMap.has(ele.date)){
                myMap.set(ele.date,myMap.get(ele.date)+(ele.stats.additions-ele.stats.deletions))
            }else{
                myMap.set(ele.date,(ele.stats.additions-ele.stats.deletions));
            }
        })
        arr = Array.from(myMap);
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
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
            <div style={{ width: 600 }}>
                <Line
                    data={{
                        labels: arr.map((ele) => ele[0]),
                        datasets: [{
                          label: 'Total Lines of New Code',
                          data: arr.map((ele) => ele[1]),
                          borderColor: 'rgba(255, 205, 86)',
                          backgroundColor: 'rgba(255, 255, 255)',
                          tension: 0.1
                        }]
                    }}
                    options={{
                        plugins: {
                            title: {
                              display: true,
                              text: 'Lines of new code added per day (from 7 days ago)',
                            },
                        }
                    }}
                    
                />
            </div>
            </div>
            ):(<h1>Loading.....</h1>)}
        </div>
    )
}

export default NewWork;