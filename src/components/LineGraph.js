import React, { useState, useEffect } from 'react'

import numeral from 'numeral';

import { Line } from 'react-chartjs-2';

const options = {
    legend: {
        display: false,
    },
    
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },

    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return numeral(value).format('0a');
                    }
                }
            }
        ]
    }
};



// Function to build uo Chart Data
    const buildChartData = (data, casesType) => {
        let chartData = [];
        let lastDataPoint;

        for(let date in data.cases) {
            if(lastDataPoint){
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint,
                }

                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }

        return chartData;
    }



const LineGraph = ({ casesType='cases', className }) => {

    const [data, setData] = useState({});

    // https://disease.sh/v3/covid-19/historical/all?lastdays=120


    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => {
                return response.json();
            })
            .then(data => {
                let chartData = buildChartData(data, casesType);
                setData(chartData);
                
            })
        }
        fetchData();

    }, [casesType]) // casesType not defined -> Needed to get this from props.

    
    return (
        <div className={className}>

            {data?.length > 0 && (
                <Line options = {options} 
                data={{
                datasets: [{
                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                    borderColor: "#CC1034",
                    data
                }

                ]
            }}    
            />  
            )}
                
        </div>
    )
}

export default LineGraph
