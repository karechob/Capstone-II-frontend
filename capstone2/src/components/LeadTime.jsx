import axios from "axios";
import { React, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

const LeadTime = (props) => {
    const [leadTime, setLeadTimeState] = useState();

    const fetchLeadTimeDate = async () => {
        const result = await axios.get(
            `http://localhost:8080/api/github/leadTime?owner=${props.data.onwer}&repo=${props.data.repo}`
        );
        console.log(result.data.commit_data);
        setLeadTimeState(result.data);
    }

    useEffect(() => {
        fetchLeadTimeDate();
    }, []);

    return (
        <div align='center' id='LeadTimeForChanges' style={{ width : '50em'}}>
            {leadTime === undefined ? (<h1>LOADING...</h1>) : 
                (
                    <Line 
                        data= {{
                            labels: leadTime.commit_data.map((elements) => {return elements.date}),
                            datasets: [
                                {
                                    label : 'Lead Time for Changes',
                                    data: leadTime.commit_data.map((elements) => {return elements.data.length}),
                                    borderColor: 'red',
                                    backgroundColor: 'pink',
                                    pointStyle: 'rectRounded',
                                    pointRadius: 5,
                                    pointHoverRadius: 15
                                }
                            ]
                        }}
                        
                        options= {{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Lead Time for Changes',
                                    align : 'start',
                                    font: {
                                        family: "Times",
                                        size: 30,
                                        style: "normal",
                                        lineHeight: 1.6,
                                    }
                                },
                                legend: {
                                    display: false,
                                }
                            },
                            scales : {
                                x : {
                                    display: true,
                                    text: "Day",
                                    font: {
                                        family: "Times",
                                        size: 20,
                                        style: "normal",
                                        lineHeight: 1.2,
                                    }
                                },
                                y : {
                                    display: true,
                                    text: "Day",
                                    font: {
                                        family: "Times",
                                        size: 20,
                                        style: "normal",
                                        lineHeight: 1.2,
                                    }
                                }
                            } 
                        }}
                    />
                )
            }
        </div>
    );
}

export default LeadTime;