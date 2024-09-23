import React from "react";
import MainDashboard from "views/admin/default";
// import NFTMarketplace from "views/admin/marketplace";
// import DataTables from "views/admin/tables";
import Profile from "views/admin/profile";
import Users from "views/admin/users";
import { FaUsers } from "react-icons/fa";
import { SiGnuprivacyguard } from "react-icons/si";
import {
  MdHome,
  MdPerson,
  // MdOutlineShoppingCart,
  // MdBarChart,
  // MdLock,
} from "react-icons/md";
import CreateUser from "views/admin/createUser/CreateUser";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },

  // {
  //   name: "Data Tables",
  //   layout: "/admin",
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   path: "data-tables",
  //   component: <DataTables />,
  // },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },

  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <FaUsers className="h-6 w-6" />,
    component: <Users />,
  },
  {
    name: "Create User",
    layout: "/admin",
    path: "createuser",
    icon: <SiGnuprivacyguard className="h-6 w-6" />,
    component: <CreateUser />,
  },
  {
    name: "Upload CSV File",
    layout: "/admin",
    path: "nft-marketplace",
    // icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    // component: <NFTMarketplace />,
    secondary: true,
  },
];
export default routes;
