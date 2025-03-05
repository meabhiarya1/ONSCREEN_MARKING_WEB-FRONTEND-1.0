import BarChart from "./charts/BarChart";
import DoughnutChart from "./charts/DoughnutChart";
import Boxes from "./boxes/Boxes";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { MdOutlineScanner } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { RiAiGenerate } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { IoBookSharp } from "react-icons/io5";
import { MdLibraryBooks } from "react-icons/md";
import { BsClipboard2DataFill } from "react-icons/bs";

const Dashboard = () => {

  useEffect(()=>{},[])

  const [expandedChart, setExpandedChart] = useState(null);
  const [showData, setShowData] = useState(false);
  const [selectedChartData, setSelectedChartData] = useState(null);

  const dataSets = {
    Users: { labels: ["Admin", "Evaluator", "Moderator"], data: [10, 15, 20] },
    "Scanned Data": {
      labels: ["Sheet1", "Sheet2", "Sheet3"],
      data: [300, 450, 600],
    },
    Tasks: {
      labels: ["Pending", "Completed", "In Progress"],
      data: [20, 50, 10],
    },
    "Result Generated": { labels: ["Pass", "Fail"], data: [80, 20] },
    Schemas: { labels: ["Schema A", "Schema B", "Schema C"], data: [5, 8, 12] },
    Classes: { labels: ["Class 1", "Class 2", "Class 3"], data: [25, 30, 40] },
    Courses: { labels: ["Math", "Science", "English"], data: [12, 20, 15] },
    Booklets: { labels: ["Booklet A", "Booklet B"], data: [100, 150] },
    ResultGenerated: { labels: ["Results Generated"], data: [100] },
    ScannedData: { labels: ["Scanned Data"], data: [150] },
  };

  const labels = Object.keys(dataSets);

  // Generate dataset dynamically by summing up the `data` array for each category
  const processedData = labels.map((category) =>
    dataSets[category].data.reduce((acc, val) => acc + val, 0)
  );

  const handleBoxClick = (title) => {
    setSelectedChartData(dataSets[title]);
  };

  const openChart = (chartType) => {
    setExpandedChart(chartType);
  };

  const closeChart = () => {
    setExpandedChart(null);
  };

  return (
    <div className="dashboard relative p-5 dark:text-white">
      {/* Boxes Area */}
      <div className="boxes mb-5 flex flex-col items-center justify-start gap-5 sm:gap-5 md:flex-row md:gap-3 lg:gap-7">
        <Boxes
          icon={<FaUsers fontSize={36} />}
          title={"Users"}
          amount={processedData[0]}
          // percentage={100}
          event={() => handleBoxClick("Users")}
        />
        <Boxes
          icon={<MdOutlineScanner fontSize={36} />}
          title={"Scanned Data"}
          amount={processedData[1]}
          // percentage={45}
          event={() => handleBoxClick("ScannedData")}
        />
        <Boxes
          icon={<FaTasks fontSize={36} />}
          title={"Tasks"}
          amount={processedData[2]}
          // percentage={45}
          event={() => handleBoxClick("Tasks")}
        />
        <Boxes
          icon={<RiAiGenerate fontSize={36} />}
          title={"Result Generated"}
          amount={processedData[3]}
          // percentage={45}
          event={() => handleBoxClick("ResultGenerated")}
        />
      </div>

      {showData && (
        <>
          <div className="boxes flex flex-col items-center justify-start gap-5 transition-all sm:gap-5 md:flex-row md:gap-3 lg:gap-7">
            <Boxes
              icon={<BsClipboard2DataFill fontSize={36} />}
              title={"Schemas"}
              amount={processedData[4]}
              // percentage={100}
              event={() => handleBoxClick("Schemas")}
            />
            <Boxes
              icon={<SiGoogleclassroom fontSize={36} />}
              title={"Classes"}
              amount={processedData[5]}
              // percentage={45}
              event={() => handleBoxClick("Classes")}
            />
            <Boxes
              icon={<IoBookSharp fontSize={36} />}
              title={"Courses"}
              amount={processedData[6]}
              // percentage={45}
              event={() => handleBoxClick("Courses")}
            />
            <Boxes
              icon={<MdLibraryBooks fontSize={36} />}
              title={"Booklets"}
              amount={processedData[7]}
              // percentage={45}
              event={() => handleBoxClick("Booklets")}
            />
          </div>
        </>
      )}

      <div className="mt-5 flex cursor-pointer justify-between">
        <div className="text-indigo-600 font-semibold dark:text-indigo-400">
          Click on any above data to see detailed insights...
        </div>
        <div
          className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-all"
          onClick={() => {
            setShowData(!showData);
          }}
        >
          {showData ? "Show Less..." : "Show More Analytics..."}
        </div>
      </div>

      <div className="my-6 text-4xl font-semibold">Data Analytics</div>

      {/* Charts Area */}
      <div className="charts my-7 flex flex-col items-center justify-center gap-5 lg:flex-row lg:items-start lg:gap-7">
        {/* Bar Chart Section */}
        <div
          onClick={() => openChart("bar")}
          className="bar w-full cursor-pointer rounded-xl border-blue-300 bg-white p-4 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100 hover:border hover:shadow-xl dark:bg-navy-700 dark:shadow-gray-800 md:w-full lg:w-7/12"
        >
          <div className="flex h-72 items-center justify-center sm:h-80 md:h-96">
            <BarChart realData={selectedChartData} />
          </div>
        </div>

        {/* Doughnut Chart Section */}
        <div
          onClick={() => openChart("doughnut")}
          className="line w-full cursor-pointer rounded-xl border-blue-300 bg-white p-4 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100 hover:border hover:shadow-xl dark:bg-navy-700 dark:shadow-gray-800 md:w-full lg:w-5/12"
        >
          <div className="flex h-72 justify-center sm:h-80 md:h-96">
            <DoughnutChart realData={selectedChartData} />
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
            {expandedChart === "bar" && (
              <BarChart realData={selectedChartData} />
            )}
            {expandedChart === "doughnut" && (
              <div className="flex items-center justify-center sm:mx-auto md:mx-auto md:w-1/2 lg:mx-auto lg:w-1/2">
                <DoughnutChart realData={selectedChartData} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
