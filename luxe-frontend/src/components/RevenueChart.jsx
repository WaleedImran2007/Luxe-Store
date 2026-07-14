import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register the modules with Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const RevenueChart = ({ revenueData }) => {
    const data = {
        labels: revenueData.map(item => item.month),

        datasets: [
            {
                label: 'Revenue',
                data: revenueData.map(item => item.revenue),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.15)",
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3,
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false,
            },

            title: {
                display: false,
            },
        },

        interaction: {
            intersect: false,
            mode: "index",
        },

        scales: {
            y: {
                beginAtZero: true,

                grid: {
                    color: "#E5E7EB",
                },

                ticks: {
                    callback: (value) => `Rs. ${value.toLocaleString()}`
                }
            },

            x: {
                grid: {
                    display: false,
                }
            }

        }

    }

    return <>
        <div className="h-80">

            <Line
                data={data}
                options={options}
            />

        </div>
    </>

}

export default RevenueChart;