import { Card } from "antd";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

function LineChart() {
  const data = {
    labels: ["Du", "Se", "Chor", "Pay", "Ju", "Sha", "Ya"],
    datasets: [
      {
        label: "Plan",
        data: [2, 4, 6, 1, 10, 11, 12, 13, 14],
        backgroundColor: "#5D87FF",
        borderColor: "#5D87FF",
        borderWidth: 5,
        pointBorderColor: "#5D87FF",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Rejadan ortga qolish",
        data: [3, 1, 6.5, 9, 13, 4],
        backgroundColor: "#FF1686",
        borderColor: "#FF1686",
        borderWidth: 5,
        pointBorderColor: "#FF1686",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    plagins: {
      legend: true,
    },
    scales: {
      // y: {
      //   min: 3,
      //   max: 6,
      // },
    },
  };

  return (
    <Card style={{ maxWidth: "600px", width: "100%" }}>
      <Line data={data} options={options}></Line>
    </Card>
  );
}

export default LineChart;
