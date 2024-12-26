import React from "react";
import CustomAddButton from "UI/CustomAddButton";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
const index = ( props) => {
  return (
    <div>
      <button
        type="button"
        className="mb-2  w-[100%] rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Next Booklet
      </button>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Question no.
              </th>
              <th scope="col" className="px-6 py-3">
                Alloted Marks
              </th>
              <th scope="col" className="px-6 py-3">
                Max Marks
              </th>
            </tr>
          </thead>
          <tbody className="h-[60vh] overflow-auto">
            <tr className="h-16 border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Q1
              </th>
              <td className="px-6 py-4">
                <IconButton color="primary" aria-label="add to shopping cart">
                  <AddCircleOutlineIcon />
                </IconButton>
              </td>
              <td className="px-6 py-4">10</td>
            </tr>
            <tr className="h-16 border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Q2
              </th>
              <td className="px-6 py-4">
                <input
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </td>
              <td className="px-6 py-4">10</td>
            </tr>
            <tr className=" h-16 bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Q3
              </th>
              <td className="px-6 py-4">
                <input
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </td>
              <td className="px-6 py-4">10</td>
            </tr>
            <tr className="h-4 bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Q3
              </th>
              <td className="px-6 py-4">
                <input
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </td>
              <td className="px-6 py-4">10</td>
            </tr>
            <tr className="h-4 bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Q3
              </th>
              <td className="px-6 py-4">
                <input
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </td>
              <td className="px-6 py-4">10</td>
            </tr>
            <tr className="h-4 bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Q3
              </th>
              <td className="px-6 py-4">
                <input
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </td>
              <td className="px-6 py-4">10</td>
            </tr>

            <hr />
            <tr className="h-4 bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                TOTAL
              </th>
              <td className="px-6 py-4">
                <input
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </td>
              <td className="px-6 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="mb-2  w-[100%] rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
      >
        REJECT BOOKLET
      </button>
      <button
        type="button"
        className="mb-2  w-[100%] rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
      >
        SUBMIT BOOKLET
      </button>
    </div>
  );
};

export default index;
