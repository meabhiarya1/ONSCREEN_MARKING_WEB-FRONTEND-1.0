import axios from "axios";
import React, { useEffect, useState } from "react";
import FileManagerModal from "./FileManagerModal";
import { toast } from "react-toastify";

const EditAssingModal = ({
  setShowEditModal,
  currentTask,
  setShowTaskModal,
  setCurrentTask,
}) => {
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    setSelectedPath(currentTask?.folderPath || "");
  }, [currentTask]);

  const handleSubmitButton = async (currentTask) => {
    const updatedTask = {
      ...currentTask,
      folderPath: selectedPath,
      userId: currentTask.userId._id,
    };

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
      // console.log(response);
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
        <div className="mx-auto max-w-[330px] rounded-xl bg-white shadow-lg drop-shadow-md dark:bg-navy-700 dark:text-white sm:max-w-[400px]">
          <div className="flex justify-between px-4 py-3">
            <div>
              <h2 className="text-xl font-bold sm:text-3xl">Task Details</h2>
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
              <div className="flex gap-8 px-4 sm:justify-center sm:px-0">
                <p className="sm:text-md text-sm font-bold text-gray-700 dark:text-white">
                  Task Name:{" "}
                </p>{" "}
                <input
                  type="text"
                  value={currentTask?.taskName}
                  className="sm:text-md mx-2  rounded-md border border-gray-300 bg-gray-200 px-2 py-[2px] text-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                  onChange={(e) =>
                    setCurrentTask((prev) => ({
                      ...prev,
                      taskName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-6 px-4 sm:justify-center sm:px-0">
                <p className="sm:text-md text-sm font-bold text-gray-700 dark:text-white">
                  Class Name:{" "}
                </p>{" "}
                <input
                  type="text"
                  value={currentTask?.className}
                  className="sm:text-md mx-2  rounded-md border border-gray-300 bg-gray-200 px-2 py-[2px] text-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                  disabled
                />
              </div>
            </div>
            {/* <div className="flex flex-col "> */}
            <div className="flex gap-3 px-4 sm:justify-center sm:px-0">
              <p className="sm:text-md text-sm font-bold text-gray-700 dark:text-white">
                {" "}
                Subject Code:{" "}
              </p>{" "}
              <input
                type="text"
                value={currentTask?.subjectCode}
                className="sm:text-md mx-2  rounded-md border border-gray-300 bg-gray-200 px-2 py-[2px] text-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                disabled
              />
            </div>

            <div className="flex px-4 sm:justify-center sm:px-0">
              <p className="sm:text-md text-sm font-bold text-gray-700 dark:text-white">
                {" "}
                Total Files:{" "}
              </p>{" "}
              <input
                type="text"
                value={currentTask?.totalFiles}
                className="sm:text-md mx-2 ml-11 rounded-md border border-gray-300 bg-gray-200 px-2 py-[2px] text-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                disabled
              />
            </div>
            {/* </div>{" "} */}
            <div className="flex gap-5 px-4 sm:justify-center sm:px-0">
              <p className="sm:text-md text-sm font-bold text-gray-700 dark:text-white">
                {" "}
                Assigned To:{" "}
              </p>{" "}
              <input
                type="text"
                value={currentTask?.userId?.email}
                className="sm:text-md mx-2  rounded-md border border-gray-300 bg-gray-200 px-2 py-[2px] text-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                disabled
              />
            </div>
          </div>{" "}
          <div
            className="mx-3 mb-2 flex items-center "
            onClick={() => {
              // setShowFileManager(true);
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
              className="bg-transparent h-12 w-full rounded-lg border border-gray-300  px-4 text-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
              disabled
              onChange={(e) =>
                selectedPath
                  ? setSelectedPath(e.target.value)
                  : setSelectedPath(currentTask?.folderPath)
              }
            />
            
          </div>
          <div class="mx-3 text-center">
            <button
              class="my-2 mb-3 w-full rounded-md bg-indigo-600 px-16 py-1 text-lg font-bold text-white hover:bg-indigo-700"
              onClick={() => {
                // setShowEditModal(false);
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
