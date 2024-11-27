import { data } from "autoprefixer";
import React from "react";

const SchemaDeleteModal = ({
  deleteShowModal,
  setDeleteShowModal,
  handleConfirmDelete,
  id,
}) => {
  if (!deleteShowModal) return null; // Don't render modal if showModal is false

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {/* Close button */}
        <button
          className="absolute right-2 top-2 text-2xl font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={() => setDeleteShowModal(false)} // Handle close when 'X' is clicked
        >
          &times;
        </button>

        {/* Modal content */}
        <div className="text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">
            Are you sure you want to delete this item?
          </h3>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                handleConfirmDelete(id);
              }}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteShowModal(false)}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-900 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              No, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaDeleteModal;
