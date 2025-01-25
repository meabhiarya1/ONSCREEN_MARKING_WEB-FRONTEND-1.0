import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EditAssingModal = ({
  setShowEditModal,
  currentTask,
  setShowTaskModal,
  setCurrentTask,
  updateTaskInParent,
}) => {
  const [taskName, setTaskName] = useState(currentTask?.taskName);
  const [loader, setLoader] = useState(false);


  useEffect(() => {
    setTaskName(currentTask?.taskName);
  }, [currentTask]);

  const handleSubmitButton = async () => {
    const updatedTask = {
      ...currentTask,
      taskName: taskName,
      userId: currentTask.userId._id,
    };
    try {
      setLoader(true);
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
      updateTaskInParent(updatedTask);
      toast.success("Task updated successfully");
      setShowEditModal(false);
      setShowTaskModal(false);
      setCurrentTask({});
    } catch (error) {
      console.error(error);
      toast.error("Error updating task");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <div className="w-full max-w-md scale-95 transform rounded-lg bg-white p-4 m-2 sm:p-8 shadow-xl dark:bg-navy-700">
        {/* transition-all duration-300 ease-in-out hover:scale-100 */}
        <h3 className="mb-6 text-center text-2xl font-semibold text-indigo-800 dark:text-white">
          Edit Task
        </h3>

        <div className="space-y-6">
          {/* <div>
            <label
              htmlFor="taskName"
              className="text-sm sm:text-lg font-medium text-gray-700 dark:text-white"
            >
              Task Name
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-lg"
            />
          </div> */}

          <div>
            <label
              htmlFor="subjectCode"
              className="text-sm sm:text-lg font-medium text-gray-700 dark:text-white"
            >
              Subject Code
            </label>
            <input
              type="text"
              id="subjectCode"
              value={currentTask?.subjectCode}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-lg"
              disabled
            />
          </div>

          {/* <div>
            <label
              htmlFor="className"
              className="text-sm sm:text-lg font-medium text-gray-700 dark:text-white"
            >
              Class Name
            </label>
            <input
              type="text"
              id="className"
              value={currentTask?.className}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-lg"
              disabled
            />
          </div> */}

          <div>
            <label
              htmlFor="totalFiles"
              className="text-sm sm:text-lg font-medium text-gray-700 dark:text-white"
            >
              Total Files
            </label>
            <input
              type="number"
              id="totalFiles"
              value={currentTask?.totalBooklets}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-lg"
              disabled
            />
          </div>

          {/* <div>
            <label
              htmlFor="folderPath"
              className="text-sm sm:text-lg font-medium text-gray-700 dark:text-white"
            >
              Folderpath
            </label>
            <input
              type="text"
              id="folderPath"
              value={currentTask?.folderPath}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-900 dark:text-white text-sm sm:text-lg"
              disabled
            />
          </div> */}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => setShowEditModal(false)}
            className="rounded-md bg-red-500 px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitButton}
            className="rounded-md bg-indigo-600 font-medium text-white transition-all duration-200 hover:bg-indigo-700"
            disabled={loader}
          >
            {loader ? (
              // <div class="h-6 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
              <div
              className={`flex justify-center items-center rounded-md px-6 py-2 ${
                loader ? "bg-indigo-400" : "bg-indigo-600"
              }`}
            >
              <svg
                className="mr-2 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Updating...
            </div>
            ) : (
              <div className="px-6 py-2">Update</div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssingModal;
