
import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import routes from "routes.js";
import { useEffect, useState } from "react";
import { getUserDetails } from "../../services/common";

const Sidebar = ({ open, onClose }) => {
  const [currentRoutes, setCurrentRoutes] = useState([]);
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserDetails(token);
        console.log(data)
        const filteredRoutes = routes.filter((route) => data?.permissions?.includes(route?.name));
        setCurrentRoutes(filteredRoutes)
      }
      catch (error) {

      }
    }
    fetchUser()
  }, [])


  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0" : "-translate-x-96"
        }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          OMR <span class="font-medium">INDIA</span>
        </div>
      </div>
      <div class="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      <ul className="mb-auto pt-1">
        <Links routes={currentRoutes} />
      </ul>

    </div>
  );
};

export default Sidebar;
