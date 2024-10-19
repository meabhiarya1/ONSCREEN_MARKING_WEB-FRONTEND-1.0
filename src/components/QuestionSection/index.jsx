import React from "react";

const index = () => {
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
                Question 1
              </th>
              <td className="px-6 py-4">
                <input
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </td>
              <td className="px-6 py-4">10</td>
            </tr>
            <tr className="h-16 border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Question 2
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
                Question 3
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
                Question 3
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
                Question 3
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
                Question 3
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
    </div>
  );
};

export default index;
