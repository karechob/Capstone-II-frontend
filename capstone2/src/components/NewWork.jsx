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

    async function fetchNewCodeData(){
        myMap.clear();
        arr.length = 0;
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
                          label: 'My First Dataset',
                          data: arr.map((ele) => ele[1]),
                          borderColor: 'rgb(75, 192, 192)',
                          tension: 0.1
                        }]
                    }}
                    options={{
                        plugins: {
                            title: {
                              display: true,
                              text: `Total Lines of Changes`,
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