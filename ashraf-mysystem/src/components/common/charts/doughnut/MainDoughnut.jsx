import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./mainDoughnut.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function MainDoughnut() {
  const data = {
    labels: ["Xomashyo 1", "Xomashyo 2", "Xomashyo 3"],
    datasets: [
      {
        // label: "Poll",
        data: [2, 9, 4],
        backgroundColor: ["#5D87FF", "#49BEFF", "#13DEB9"],
        borderRadius: 4,
        hoverOffset: 20,
        cutout: "85",
      },
    ],
  };

  const options = {
    // maintainAspectRatio: false,
    // responsive: true,
    layout: {
      padding: 20,
    },
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;

      ctx.save();
      ctx.font = "bolder 21px sans-serif";
      ctx.fillStyle = "#2A3547";
      ctx.textAlign = "center";
      ctx.textBaseLine = "middle";
      ctx.fillText(
        "+1000ta",
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
      );
    },
  };

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>MainDoughnut</h1>
      <p className={styles.text}>MainDoughnut</p>
      <div>
        <Doughnut data={data} options={options} plugins={[textCenter]} />
      </div>
    </div>
  );
}

export default MainDoughnut;
