import MainDashboard from "views/admin/default";
import Upload from "views/admin/upload";
import Classes from "views/admin/classes";
import Profile from "views/admin/profile";
import Users from "views/admin/users";
import { FaUsers } from "react-icons/fa";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaFileUpload } from "react-icons/fa";
import { MdHome, MdPerson } from "react-icons/md";
import CreateUser from "views/admin/createUser/CreateUser";
import { IoBookSharp } from "react-icons/io5";
import CourseDetails from "views/admin/courseDetails";
import CreateSchema from "views/admin/createSchema/createSchema";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    hidden: false,
  },
  {
    name: "Classes",
    layout: "/admin",
    icon: <IoBookSharp className="m-1 h-5 w-5" />,
    path: "courses",
    component: <Classes />,
    hidden: false,
  },
  {
    name: "Course Detail",
    layout: "/admin",
    icon: <IoBookSharp className="m-1 h-5 w-5" />,
    path: "classes/:id",
    component: <CourseDetails />,
    hidden: true,
  },
  {
    name: "Create Schema",
    layout: "/admin",
    icon: <IoBookSharp className="m-1 h-5 w-5" />,
    path: "schema/create/:id",
    component: <CreateSchema />,
    hidden: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    hidden: false,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <FaUsers className="h-6 w-6" />,
    component: <Users />,
    hidden: false,
  },
  {
    name: "Create User",
    layout: "/admin",
    path: "createuser",
    icon: <SiGnuprivacyguard className="h-6 w-6" />,
    component: <CreateUser />,
    hidden: false,
  },
  {
    name: "Upload CSV File",
    layout: "/admin",
    path: "uploadcsv",
    icon: <FaFileUpload className="h-5 w-5" />,
    component: <Upload />,
    hidden: false,
  },
];

export default routes;
