import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart elements with Chart.js
ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DoughnutChart = ({realData}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };

    // Initial check on mount
    checkDarkMode();

    // Add event listener for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Doughnut chart data
  const data = {
    labels: realData?.labels || ["UPSC", "BPSC", "MK University"], // Labels for the chart
    datasets: [
      {
        data: realData?.data || [12, 19, 3], // Values for the chart
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(153, 102, 255, 0.6)", // Purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 20, // Border width for the segments
      },
    ],
  };

  // Doughnut chart options with dark mode
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
          },
          color: isDarkMode ? 'white' : 'black',
        },
      },
      title: {
        display: true,
        text: 'Task Status',
        font: {
          size: 18,
        },
        color: isDarkMode ? 'white' : 'black',
      },
      animation: {
        duration: 300, // Controls animation duration (in milliseconds)
        easing: "easeOutQuart", // Easing function for smooth transitions
      },
      hover: {
        mode: "nearest", // Interaction mode for hovering
        animationDuration: 300, // Duration of the hover animation
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
