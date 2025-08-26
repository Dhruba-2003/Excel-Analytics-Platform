import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = ({ chartData, xAxisLabel, yAxisLabel }) => {
  const data = {
    labels: chartData.map((item) => item[xAxisLabel]),
    datasets: [
      {
        label: yAxisLabel,
        data: chartData.map((item) => item[yAxisLabel]),
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${yAxisLabel} by ${xAxisLabel}`},
    },
    scales: { y: { beginAtZero: true } }
  };
  return <Bar options={options} data={data} />;
};

export default Chart;