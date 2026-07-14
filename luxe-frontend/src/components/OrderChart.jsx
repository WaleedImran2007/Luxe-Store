import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


const OrderChart = ({ statusData = {} }) => {
    const data = {
        labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],

        datasets: [
            {
                data: [
                    statusData.Pending,
                    statusData.Processing,
                    statusData.Shipped,
                    statusData.Delivered
                ],

                backgroundColor: [
                    "#FACC15",
                    "#3B82F6",
                    "#8B5CF6",
                    "#22C55E",
                    "#EF4444"
                ],

                borderWidth: 0,

                hoverOffset: 8
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: "bottom"
            }

        },

        cutout: "75%"

    }


    return <>
        <div className="h-80">
            <Doughnut
                data={data}
                options={options}
            />
        </div>
    </>

}

export default OrderChart;