import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import routes from "routes.js";
import { useEffect, useState } from "react";
import { getUserDetails } from "../../services/common";
import logo from "../../assets/img/dashboards/omr _logo.png";
import { GiCrossMark } from "react-icons/gi";

const Sidebar = ({ open, onClose }) => {
  const [currentRoutes, setCurrentRoutes] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserDetails(token);

        let filteredRoutes = [];
        if (data?.role === "admin") {
          // console.log(data?.role);
          filteredRoutes = routes.filter(
            (route) =>
              data?.permissions?.includes(route?.name) &&
              !route?.hidden &&
              route?.layout === "/admin"
          );
        } else if (data?.role === "evaluator" || data?.role === "moderator") {
          filteredRoutes = routes.filter(
            (route) =>
              data?.permissions?.includes(route?.name) &&
              !route?.hidden &&
              route?.layout === "/evaluator"
          );
        }
        setCurrentRoutes(filteredRoutes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden  "
        onClick={onClose}
      >
        {/* <HiX className="text-navy-100" /> */}
        <GiCrossMark className="text-navy-100" />
      </span>{" "}
      <div className="mx-[48px] mt-2 flex justify-center  rounded-lg font-poppins font-bold uppercase text-navy-700 dark:text-white">
        <img src={logo} alt="logo" className="mt-2 h-32 w-32" />
      </div>
      {/* <div
        className={`mx-[56px]   flex flex-col items-center space-y-4`}
      >
        <div className="ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          OMR <span className="font-medium">INDIA</span>
        </div>
      </div> */}
      <div class="mb-7  h-px bg-gray-300 dark:bg-white/30" />
      <ul className="mb-auto pt-1">
        <Links routes={currentRoutes} />
      </ul>
    </div>
  );
};

export default Sidebar;
