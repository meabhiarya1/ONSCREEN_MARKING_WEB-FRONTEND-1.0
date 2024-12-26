import MainDashboard from "views/admin/default";
import EvaluatorTasks from "views/evaluator/AllTasks/AllTasks";
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
import Schema from "views/admin/schemas/Schema";
import CreateSchemaStructure from "views/admin/createSchemaStructure/createSchemaStructure";
import SelectCoordinates from "views/admin/coordinates/SelectCoordinates";
import CoordinateSelection from "views/admin/coordinates/CoordinateSelection";
import Tasks from "views/admin/tasks/Tasks";
import AssignPage from "views/admin/assignPage/AssignPage";
import { BiTask } from "react-icons/bi";
import CheckModule from "views/evaluator/CheckModule/CheckModule";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    hidden: false,
  },

  {
    name: "Classes",
    layout: "/admin",
    icon: <IoBookSharp className=" h-6 w-6" />,
    path: "courses",
    component: <Classes />,
    hidden: false,
  },
  {
    name: "Course Detail",
    layout: "/admin",
    icon: <IoBookSharp className="h-6 w-6" />,
    path: "classes/:id",
    component: <CourseDetails />,
    hidden: true,
  },
  {
    name: "Create Schema",
    layout: "/admin",
    icon: <IoBookSharp className=" h-6 w-6" />,
    path: "schema/create/:id",
    component: <CreateSchema />,
    hidden: true,
  },
  {
    name: "Schema Structure",
    layout: "/admin",
    icon: <IoBookSharp className=" h-6 w-6" />,
    path: "schema/create/structure/:id",
    component: <CreateSchemaStructure />,
    hidden: true,
  },
  {
    name: "Structure Coordinates",
    layout: "/admin",
    icon: <IoBookSharp className=" h-6 w-6" />,
    path: "schema/create/structure/coordinates/:id",
    component: <SelectCoordinates />,
    hidden: true,
  },
  {
    name: "Select Coordinates",
    layout: "/admin",
    icon: <IoBookSharp className=" h-6 w-6" />,
    path: "coordinates/:id",
    component: <CoordinateSelection />,
    hidden: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    hidden: true,
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
    icon: <FaFileUpload className="h-6 w-6" />,
    component: <Upload />,
    hidden: true,
  },

  {
    name: "Schema",
    layout: "/admin",
    path: "schema",
    icon: <FaFileUpload className="h-6 w-6" />,
    component: <Schema />,
    hidden: false,
  },
  {
    name: "Tasks",
    layout: "/admin",
    path: "tasks",
    icon: <BiTask className="h-6 w-6" />,
    component: <Tasks />,
    hidden: false,
  },
  {
    name: "Assign Tasks",
    layout: "/admin",
    path: "subjects/:id",
    icon: <BiTask className="h-6 w-6" />,
    component: <AssignPage />,
    hidden: false,
  },
  {
    name: "Evaluator",
    layout: "/evaluator",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    hidden: false,
  },

  // {
  //   name: "Evaluator Image Area",
  //   layout: "/evaluator",
  //   path: "task/:id",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <CheckModule />,
  //   hidden: true,
  // },

  {
    name: "Assigned Tasks",
    layout: "/evaluator",
    path: "assignedtasks",
    icon: <BiTask className="h-6 w-6" />,
    component: <EvaluatorTasks />,
    hidden: false,
  },
];

export default routes;
