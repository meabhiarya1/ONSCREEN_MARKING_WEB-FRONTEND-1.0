import { PiExportDuotone } from "react-icons/pi";
import LineChart from "./charts/LineChart";

const Dashboard = () => {
  return (
    <div className="p-5 flex flex-col gap-10 w-full">
      <div className="data-1 flex flex-col gap-5 h-72 lg:flex-row lg:gap-5">
        <div className="Content-1 w-3/5 bg-white p-4 rounded-lg h-full">
          <div className="flex py-4">
            <div>
              <div>Today's Sales</div>
              <div>Sales Summary</div>
            </div>
            <div><span><PiExportDuotone /></span><button>Export</button></div>
          </div>
          {/* colorful boxes */}
          <div className="flex gap-10">
            <div className="bg-red-200 h-32 w-40 rounded-md">a</div>
            <div className="bg-yellow-200 h-32 w-40 rounded-md">b</div>
            <div className="bg-green-200 h-32 w-40 rounded-md">c</div>
            <div className="bg-purple-200 h-32 w-40 rounded-md">d</div>
          </div>
        </div>
        <div className="Content-2 w-1/3 bg-white p-4 rounded-lg h-full">
        <LineChart />
        </div>
      </div>

      <div className="data-2 flex justify-starrt items-center gap-5 h-64">
        <div className="Content-4 w-5/12 bg-white p-4 rounded-lg h-full"></div>
        <div className="Content-5 w-3/12 bg-white p-4 rounded-lg h-full"><LineChart /></div>
        <div className="Content-6 w-3/12 bg-white p-4 rounded-lg h-full"></div>
      </div>
    </div>
  );
};

export default Dashboard;