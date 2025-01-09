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
    setLoader(true);
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
      updateTaskInParent(updatedTask);
      toast.success("Task updated successfully");
      setShowEditModal(false);
      setShowTaskModal(false);
      setLoader(false);
      setCurrentTask({});
    } catch (error) {
      console.error(error);
      toast.error("Error updating task");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md scale-95 transform rounded-lg bg-white p-8 shadow-xl transition-all duration-300 ease-in-out hover:scale-100">
        <h3 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Edit Task
        </h3>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="taskName"
              className="text-lg font-medium text-gray-700"
            >
              Task Name
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="subjectCode"
              className="text-lg font-medium text-gray-700"
            >
              Subject Code
            </label>
            <input
              type="text"
              id="subjectCode"
              value={currentTask?.subjectCode}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="className"
              className="text-lg font-medium text-gray-700"
            >
              Class Name
            </label>
            <input
              type="text"
              id="className"
              value={currentTask?.className}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="totalFiles"
              className="text-lg font-medium text-gray-700"
            >
              Total Files
            </label>
            <input
              type="number"
              id="totalFiles"
              value={currentTask?.totalFiles}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="folderPath"
              className="text-lg font-medium text-gray-700"
            >
              Folderpath
            </label>
            <input
              type="text"
              id="folderPath"
              value={currentTask?.folderPath}
              className="mt-2 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => setShowEditModal(false)}
            className="rounded-md bg-gray-500 px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitButton}
            className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-700"
          >
            {loader ? (
              <div class="h-6 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssingModal;
