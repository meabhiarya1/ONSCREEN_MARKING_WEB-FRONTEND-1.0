import { IoBagHandle } from "react-icons/io5";
import BarChart from "./charts/BarChart";
import DoughnutChart from "./charts/DoughnutChart";
import Boxes from "./boxes/Boxes";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [expandedChart, setExpandedChart] = useState(null);

  useEffect(()=>{});

  const openChart = (chartType) => {
    setExpandedChart(chartType);
  };

  const closeChart = () => {
    setExpandedChart(null);
  };

  return (
    <div className="dashboard relative p-5 dark:text-white">
      {/* Boxes Area */}
      <div className="boxes flex flex-col items-center justify-start gap-5 sm:gap-5 md:flex-row md:gap-3 lg:gap-7">
        <Boxes
          icon={<IoBagHandle fontSize={36} />}
          title={"Total Sales"}
          amount={478540}
          percentage={45}
        />
        <Boxes
          icon={<IoBagHandle fontSize={36} />}
          title={"Total Sales"}
          amount={478540}
          percentage={45}
        />
        <Boxes
          icon={<IoBagHandle fontSize={36} />}
          title={"Total Sales"}
          amount={478540}
          percentage={45}
        />
        <Boxes
          icon={<IoBagHandle fontSize={36} />}
          title={"Total Sales"}
          amount={478540}
          percentage={45}
        />
      </div>

      <div className="my-8 text-4xl font-semibold">Data Analytics</div>

      {/* Charts Area */}
      <div className="charts my-7 flex flex-col items-center justify-center gap-5 lg:flex-row lg:items-start lg:gap-7">
        {/* Bar Chart Section */}
        <div
          onClick={() => openChart("bar")}
          className="bar w-full cursor-pointer rounded-xl border-blue-300 bg-white p-4 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100 hover:border hover:shadow-xl dark:bg-navy-700 dark:shadow-gray-800 md:w-full lg:w-7/12"
        >
          <div className="flex h-72 items-center justify-center sm:h-80 md:h-96">
            <BarChart />
          </div>
        </div>

        {/* Doughnut Chart Section */}
        <div
          onClick={() => openChart("doughnut")}
          className="line w-full cursor-pointer rounded-xl border-blue-300 bg-white p-4 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100 hover:border hover:shadow-xl dark:bg-navy-700 dark:shadow-gray-800 md:w-full lg:w-5/12"
        >
          <div className="flex h-72 justify-center sm:h-80 md:h-96">
            <DoughnutChart />
          </div>
        </div>
      </div>

      {/* Expanded Chart Modal */}
      {expandedChart && (
        <div
          className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md"
          onClick={closeChart}
        >
          <div
            className="w-11/12 max-w-4xl rounded-lg bg-white p-6 dark:bg-navy-800"
            onClick={(e) => e.stopPropagation()}
          >
            {expandedChart === "bar" && <BarChart />}
            {expandedChart === "doughnut" && (
              <div className="flex items-center justify-center sm:mx-auto md:mx-auto md:w-1/2 lg:mx-auto lg:w-1/2">
                <DoughnutChart />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
