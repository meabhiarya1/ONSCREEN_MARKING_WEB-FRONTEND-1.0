import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const DeleteConfirmationModalAssignTask = ({
  setDeleteAssign,
  currentTask,
}) => {
  const onSubmitHandler = () => {
    try {
      const response = axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tasks/remove/task/${currentTask._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Task deleted successfully");
      setDeleteAssign(false);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting task");
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 backdrop-blur-md"></div>
          </div>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:border dark:border-gray-400 dark:bg-navy-700 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div className="bg-white px-4 pb-4 pt-5 dark:bg-navy-700 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div
                  className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full   bg-red-100 sm:mx-0 sm:h-10 sm:w-10`}
                >
                  {/* Dynamic icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-lg font-medium text-gray-900 dark:text-white"
                    id="modal-title"
                  >
                    Are you sure? This action cannot be undone.
                  </h3>
                  <div className="mt-2"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-3 py-3 gap-4 sm:gap-0">
              <button
                type="button"
                onClick={onSubmitHandler}
                className={`border-transparent inline-flex w-full justify-center rounded-md border bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteAssign(false);
                }}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-navy-700 dark:text-white sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default DeleteConfirmationModalAssignTask;
