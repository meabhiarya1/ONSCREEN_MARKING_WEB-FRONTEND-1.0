import axios from "axios";
import React, { useEffect, useState } from "react";
import FileManagerModal from "./FileManagerModal";
import { toast } from "react-toastify";

const EditAssingModal = ({
  setShowEditModal,
  currentTask,
  setShowTaskModal,
  setCurrentTask,
  users,
}) => {
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    setSelectedPath(currentTask?.folderPath);
  }, []);

  const handleSubmitButton = async (currentTask) => {
    const updatedTask = { ...currentTask, folderPath: selectedPath };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/update/task/${currentTask._id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      toast.success("Task updated successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Error updating task");
    }
  };

  return (
    <div>
      <div
        className={`bg-black fixed inset-0 ${
          !showFileManager ? "z-50" : "z-0"
        } flex items-center justify-center bg-opacity-50 backdrop-blur-md`}
      >
        <div className="mx-auto max-w-[330px] sm:max-w-[400px] rounded-xl bg-white shadow-lg drop-shadow-md dark:bg-navy-700 dark:text-white">
          <div className="flex justify-between px-4 py-3">
            <div>
              <h2 className="font-bold text-xl sm:text-3xl">
                Task Details
              </h2>
            </div>
            <div
              className="cursor-pointer text-gray-600 hover:text-red-700"
              onClick={() => setShowEditModal(false)}
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
          <div className="mt-2 min-w-[400px] space-y-3 px-3 pb-6 pt-3 ">
            <div className="flex w-full flex-col space-y-3">
              <div className="flex px-4 sm:px-0 sm:justify-center gap-8">
                <p className="font-bold text-gray-700 dark:text-white text-sm sm:text-md">Task Name: </p>{" "}
                <input
                  type="text"
                  value={currentTask?.taskName}
                  className="mx-2 rounded-md  bg-gray-200 px-2 py-[2px] border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-md"
                  onChange={(e) =>
                    setCurrentTask((prev) => ({
                      ...prev,
                      taskName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex px-4 sm:px-0 sm:justify-center gap-6">
                <p className="font-bold text-gray-700 dark:text-white text-sm sm:text-md">Class Name: </p>{" "}
                <input
                  type="text"
                  value={currentTask?.className}
                  className="mx-2 rounded-md  bg-gray-200 px-2 py-[2px] border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-md"
                  disabled
                />
              </div>
            </div>
            {/* <div className="flex flex-col "> */}
              <div className="flex px-4 sm:px-0 sm:justify-center gap-3">
                <p className="font-bold text-gray-700 dark:text-white text-sm sm:text-md"> Subject Code: </p>{" "}
                <input
                  type="text"
                  value={currentTask?.subjectCode}
                  className="mx-2 rounded-md  bg-gray-200 px-2 py-[2px] border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-md"
                  disabled
                />
              </div>

              <div className="flex px-4 sm:px-0 sm:justify-center">
                <p className="font-bold text-gray-700 dark:text-white text-sm sm:text-md"> Total Files: </p>{" "}
                <input
                  type="text"
                  value={currentTask?.totalFiles}
                  className="mx-2 rounded-md ml-11 bg-gray-200 px-2 py-[2px] border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-md"
                  disabled
                />
              </div>
            {/* </div>{" "} */}
            <div className="flex px-4 sm:px-0 sm:justify-center gap-5">
              <p className="font-bold text-gray-700 dark:text-white text-sm sm:text-md"> Assigned To: </p>{" "}
              <input
                type="text"
                value={currentTask?.userId?.email}
                className="mx-2 rounded-md  bg-gray-200 px-2 py-[2px] border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-md"
                disabled
              />
            </div>
          </div>{" "}
          <div
            className="mx-3 mb-2 flex items-center "
            onClick={() => {
              setShowFileManager(true);
              setShowTaskModal(false);
            }}
          >
            <input
              type="email"
              id="Email"
              name="Email"
              placeholder="Upload File"
              autoComplete="off"
              value={selectedPath}
              className="bg-transparent h-12 w-full rounded-l-md px-4 text-sm  border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
              disabled
              onChange={(e) =>
                selectedPath
                  ? setSelectedPath(e.target.value)
                  : setSelectedPath(currentTask?.folderPath)
              }
            />
            <button className="duration-250 group  relative z-30 flex cursor-pointer  items-center justify-center overflow-hidden rounded-r-lg rounded-tr-lg bg-indigo-700 px-4 py-2.5 text-white shadow-lg transition-all hover:bg-indigo-600 hover:shadow-xl focus:bg-indigo-600 focus:shadow-xl focus:outline-none focus:ring-0 active:bg-indigo-700 active:shadow-lg ">
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
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                name="text"
              />

              <span className="duration-350 absolute inset-0  z-[-1] cursor-pointer rounded-tr-lg bg-indigo-600 transition-all group-hover:w-full"></span>
            </button>
          </div>
          <div class="mx-3 text-center">
            <button
              class="my-2 mb-3 w-full rounded-md px-16 py-1 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                setShowEditModal(false);
                handleSubmitButton(currentTask);
              }}
            >
              Submit
            </button>
          </div>
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

export default EditAssingModal;
