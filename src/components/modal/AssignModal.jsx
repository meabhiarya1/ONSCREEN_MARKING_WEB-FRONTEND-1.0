import React, { useEffect, useState } from "react";
import FileManagerModal from "./FileManagerModal";
import { getAllUsers } from "services/common";
import axios from "axios";
import { toast } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";

const AssignModal = ({
  setShowAssignModal,
  showAssignModal,
  currentSubject,
}) => {
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");
  const [users, setUsers] = useState("");
  const [selectedUser, setSelectedUser] = useState("Select User to Assign");
  const [showUserModal, setShowUserModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const users = await getAllUsers();
        setUsers(users.filter((user) => user.role !== "admin"));
      };
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setShowUserModal(false);
  }, [selectedUser]);

  useEffect(() => {
    try {
      const fetcheSubject = async () => {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/getbyid/subject/${currentSubject?.subjectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response) {
          setSelectedSubject(response.data);
          const fetchClasses = async () => {
            try {
              const responseClass = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/classes/getbyid/class/${response?.data?.classId}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              setSelectedClass(responseClass.data);
            } catch (error) {
              console.log(error);
            }
          };
          fetchClasses();
        }
      };
      fetcheSubject();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmitButton = async () => {
    if (
      selectedUser === "Select User to Assign" ||
      selectedPath === "" ||
      taskName === "" ||
      currentSubject?._id === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tasks/create/task`,
        {
          userId: selectedUser,
          subjectSchemaRelationId: currentSubject?._id,
          folderPath: selectedPath,
          status: false,
          taskName: taskName,
          className: selectedClass?.className,
          subjectCode: selectedSubject?.code + "_" + selectedSubject?.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      setShowAssignModal(false);
      toast.success("Task Assigned Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally{
      setLoading(false);
    }
  };
  const handleFileSelection = () => {
    setShowFileManager(true);
  };

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
      <div className="mx-3 sm:mx-6 w-full rounded-xl bg-white shadow-lg drop-shadow-md dark:bg-navy-700 dark:text-white md:w-2/3 lg:w-7/12 2xl:w-5/12">
        <div className="flex justify-between px-7 py-5">
          <div>
            <h2 className="font-bold" style={{ fontSize: "32px" }}>
              Assign Task
            </h2>
          </div>
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              setShowAssignModal(!showAssignModal);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>
        <hr className="bg-gray-600" />
        <div className="mt-2 space-y-2 px-5 pb-6 pt-3">
          <div className="flex">
            <div className="flex sm:w-1/2 sm:ml-10 text-sm">
              <p className="sm:pl-2 font-bold text-gray-700 dark:text-white">
                Relation Name:{" "}
              </p>{" "}
              <p className="mx-2 text-gray-700 dark:text-white">
                {currentSubject?.relationName}
              </p>
            </div>

            <div className="flex w-1/2 text-sm">
              <p className="sm:pl-2 font-bold text-gray-700 dark:text-white">
                {" "}
                Answer Images:{" "}
              </p>{" "}
              <p className="mx-2 text-gray-700 dark:text-white">
                {currentSubject?.countOfAnswerImages}
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex w-1/2 sm:ml-10 text-sm">
              <p className="sm:pl-2 font-bold text-gray-700 dark:text-white">
                {" "}
                Question Images:{" "}
              </p>{" "}
              <p className="mx-2 text-gray-700 dark:text-white">
                {currentSubject?.countOfQuestionImages}
              </p>
            </div>

            <div className="flex w-1/2 text-sm">
              <p className="sm:pl-2 font-bold text-gray-700 dark:text-white">
                {" "}
                Status:{" "}
              </p>{" "}
              <p className="mx-2 text-gray-700 dark:text-white">
                {currentSubject?.status || "Not Assigned"}
              </p>
            </div>
          </div>{" "}
          <div className="relative">
            {/* Dropdown Of users */}

            <div className="mt-5 flex items-center gap-5 3xl:gap-9 px-5">
              <div className="text-gray-700 dark:text-white">
                <label htmlFor="">Select User:</label>
              </div>

              {/* <div
                className="my-2 inline-flex w-4/5 cursor-pointer items-center overflow-hidden rounded-md border bg-white dark:bg-navy-700 dark:text-white"
                onClick={() => setShowUserModal(!showUserModal)}
              >
                <div className="w-full border-e px-5 py-2 text-sm/none text-gray-700 hover:bg-gray-50 hover:text-gray-700 dark:text-white dark:hover:bg-navy-900">
                  {selectedUser}
                </div>

                <button className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-navy-900">
                  <span className="sr-only">Menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div> */}

              <div className="w-4/5 ">
                <select
                  name="cars"
                  id="cars"
                  className="bg-transparent h-10 w-full overflow-auto rounded-lg px-2 text-sm text-gray-700 border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
                  onChange={(e) => {
                    setSelectedUser(e.target.value);
                  }}
                >
                  <option value="">Select User to Assign</option>
                  {users &&
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.email}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* {showUserModal && (
              <div
                className="absolute end-7 z-10 mt-0 w-4/5 rounded-md border border-gray-100 bg-white shadow-lg"
                role="menu"
              >
                {users &&
                  users.map((user) => (
                    <div
                      className="cursor-pointer px-5 dark:bg-navy-800 dark:text-white"
                      key={user._id}
                    >
                      <div
                        className="block rounded-lg px-4  py-3 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-900 dark:hover:text-white"
                        role="menuitem"
                        onClick={() => setSelectedUser(user.email)}
                      >
                        {user.email}
                      </div>
                    </div>
                  ))}
              </div>
            )} */}

            {/* Dropdown Of users */}
          </div>
          <div className="flex items-center gap-6 3xl:gap-10 px-5">
            <div className="text-gray-700 dark:text-white">
              <label htmlFor="taskName">Task Name:</label>
            </div>
            <div className="w-4/5">
              <input
                type="text"
                id="taskName"
                name="taskName"
                placeholder="Task Name"
                autoComplete="off"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="bg-transparent h-10 w-full rounded-lg px-5 text-sm border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
              />
            </div>
          </div>
        </div>{" "}
        <div className="flex items-center px-10 3xl:gap-5">
          <div className="text-gray-700 dark:text-white">
            <label htmlFor="Email">Upload File:</label>
          </div>
          <div className="w-5/6">
            <div className="mb-2 flex items-center px-5">
              <input
                type="email"
                id="Email"
                name="Email"
                placeholder="Upload File"
                autoComplete="off"
                value={selectedPath}
                className="bg-transparent h-12 w-full rounded-l-md px-4 text-sm border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
              />
              <button className="duration-250 group  relative z-30 flex cursor-pointer  items-center justify-center overflow-hidden rounded-r-lg rounded-tr-lg bg-indigo-600 px-4 py-2.5 text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl focus:bg-indigo-600 focus:shadow-xl focus:outline-none focus:ring-0 active:bg-indigo-700 active:shadow-lg ">
                <svg
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="30"
                  viewBox="0 0 50 50"
                  className="cursor-pointer pl-1"
                >
                  <path d="M28.8125 .03125L.8125 5.34375C.339844 5.433594 0 5.863281 0 6.34375L0 43.65625C0 44.136719 .339844 44.566406 .8125 44.65625L28.8125 49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z" />
                </svg>

                <input
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 "
                  name="text"
                  onClick={() => handleFileSelection()}
                />

                <span className="duration-350 absolute inset-0  z-[-1] cursor-pointer rounded-tr-lg bg-indigo-600 transition-all group-hover:w-full"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="px-20 py-3 text-center">
          <button
            class={`my-2 mb-3 w-full rounded-md py-1 text-lg font-bold text-white ${loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
            onClick={handleSubmitButton}
            disabled={loading}
          >
            {loading ? (
              <div className={`flex items-center justify-center w-full`}>
                <MoonLoader color="white" loading={loading} size={20} /> <span className="ml-3">Submitting...</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
      {showFileManager && (
        <FileManagerModal
          setShowFileManager={setShowFileManager}
          selectedPath={selectedPath}
          setSelectedPath={setSelectedPath}
        />
      )}
    </div>
  );
};

export default AssignModal;