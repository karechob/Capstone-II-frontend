import { React, useState, useEffect } from "react";
import { Pie,Bar,Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale , Colors} from "chart.js";
import axios from "axios";
Chart.register(Colors);
const myMap = new Map();
let arr = [];
const Impact = () =>{
    const [codebaseChanges,setCodebaseChanges] = useState();
    const [totalChanges,setTotalChanges] = useState(0);
    const [totalAdditions,setTotalAdditions] = useState(0);
    const [totalDeletions,setTotalDeletions] = useState(0);
    const [display,setDisplay] = useState(false);
    async function fetchData(ownerOfRepo,repoName){
        let changeSum = 0, additionSum = 0, deletionSum = 0;
        const result = await axios.post('http://localhost:8080/api/github/impact',{
            owner: ownerOfRepo,
            repo: repoName
        })
        result.data[0].forEach((ele)=>{
            changeSum += ele.stats.total;
            additionSum += ele.stats.additions;
            deletionSum += ele.stats.deletions;
            ele.files.forEach((file)=>{
                if(file.changes!==0){
                    if(myMap.has(file.filename)){
                        myMap.set(file.filename,myMap.get(file.filename)+file.changes)
                    }else{
                        myMap.set(file.filename,0);
                    }
                }
            })
        })
        arr = Array.from(myMap);
        setTotalChanges(changeSum);
        setTotalAdditions(additionSum);
        setTotalDeletions(deletionSum);
        setCodebaseChanges(result.data[0]);
        setDisplay(true);
    }
    useEffect(() =>{
        fetchData("karechob","Capstone-II-backend");
    },[])
    return(
        <div>
            <h1>Hi this is impact mertic</h1>Hi this is impact mertic
            {display?(
            <div>
                <div style={{ width: 400 }}>
                <Doughnut
                    data={{
                    labels: ["Additons","Deletions"],
                    datasets: [{
                        label: 'Lines of code',
                        data: [totalAdditions,totalDeletions],
                        backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4
                    }]
                    }}
                    options={{
                        plugins: {
                            title: {
                              display: true,
                              text: `Total ${totalChanges} Lines of Changes`,
                            },
                        }
                    }}
                    
                />
                </div>
                <div style={{ width: 400 }}>
                <Doughnut
                    data={{
                    labels: arr.map((ele) => ele[0]),
                    datasets: [{
                        label: 'Line of code edit',
                        data: arr.map((ele) => ele[1]),
                    hoverOffset: 4
                    }]
                    }}
                    options={{
                        plugins: {
                            title: {
                              display: true,
                              text: "Files Affected",
                            },
                        }
                    }}
                />
                </div>
            </div>):(<h1>Loading.....</h1>)}
        </div>
    );
}

export default Impact;