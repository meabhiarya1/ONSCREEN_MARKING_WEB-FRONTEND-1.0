import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/common";
import axios, { all } from "axios";
import { toast } from "react-toastify";

const AssignBookletModal = ({
  setShowAssignBookletModal,
  currentBookletDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [users, setUsers] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [assignTask, setAssignTask] = useState("");

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const users = await getAllUsers();
        setUsers(users?.filter((user) => user.role !== "admin"));
      };
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const fetchTasksBySubjectCode = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/tasks/subjectcode?subjectcode=${currentBookletDetails?.folderName}`
        );
        // console.log(response.data); // Handle the response data
        setAssignTask(response?.data);
      } catch (error) {
        console.error("Error fetching tasks:", error); // Handle errors
      }
    };

    // Usage
    if (currentBookletDetails) {
      fetchTasksBySubjectCode();
    }
  }, []);


  const handleSubmitButton = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tasks/create/task`, // API endpoint
        {
          userId: selectedUser,
          subjectCode: currentBookletDetails?.folderName,
          bookletsToAssign: currentBookletDetails?.unAllocated,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setShowAssignBookletModal(false);
      // Optionally handle the response if needed
      console.log("Task created successfully:", response?.data);
      toast.success("Task created successfully!");
    } catch (error) {
      console.log(error);
      // Display a proper error message if the server responds with an error
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const downloadBooklet = async (task) => {
    try {
      setDownloadLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/resultgeneration/getcompletedbooklets/${task._id}`,
        {
          responseType: "blob",
        }
      );
      if (response?.data?.size === 0) {
        toast.error("No data available to download");
        return;
      }
      const url = window.URL.createObjectURL(new Blob([response?.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${task?.subjectCode}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading booklet:", error); // Handle errors
    } finally {
      setDownloadLoader(false);
    }
  };

  return (
    <div>
      {" "}
      <div className="bg-black fixed inset-0 z-50 m-2 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
        <div className="mx-3 w-full rounded-xl bg-white shadow-lg drop-shadow-md dark:bg-navy-700 dark:text-white sm:mx-6 md:w-2/3 lg:w-7/12 2xl:w-6/12">
          <div className="flex justify-between px-7 py-5">
            <div>
              <h2 className="font-bold" style={{ fontSize: "32px" }}>
                Assign Task
              </h2>
            </div>
            <div
              className="cursor-pointer text-gray-600"
              onClick={() => {
                setShowAssignBookletModal(false);
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
          {/* select user dropdown */}
          <div className="space-y-2 px-3 pb-5">
            {" "}
            <div className="relative">
              {/* Dropdown Of users */}
              <div className="mt-5 flex items-center justify-between gap-2">
                <div className="flex w-full items-center gap-2 px-1 3xl:gap-2">
                  <div className="inline-block min-w-24 text-gray-700 dark:text-white">
                    <label htmlFor="" className="font-bold">
                      Select User:
                    </label>
                  </div>
                  <div className="w-full ">
                    <select
                      name=""
                      id=""
                      className="bg-transparent h-10 w-full overflow-auto rounded-lg border border-gray-300 px-2 text-sm text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                      onChange={(e) => {
                        setSelectedUser(e.target.value);
                      }}
                    >
                      <option value="">Select User to Assign</option>
                      {users &&
                        users?.map((user) => (
                          <option key={user?._id} value={user?._id}>
                            {user?.email}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                {/* submit */}
                <div>
                  <button
                    class={`my-2 mb-3 w-full rounded-md px-2 py-1 text-lg font-bold text-white sm:px-6 ${
                      loading
                        ? "bg-indigo-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                    onClick={handleSubmitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <div
                      className={`flex h-full w-full items-center justify-center ${
                        loading ? "bg-indigo-400" : "bg-indigo-600"
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
                      Submitting...
                    </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>

              {/* Dropdown Of users */}
            </div>
          </div>{" "}
          {/* Assign task details */}
          <div className="mb-4">
            {" "}
            {assignTask?.length > 0 && (
              <div class="relative max-h-44 overflow-x-auto dark:bg-navy-700">
                <table class="w-full text-left text-sm text-gray-700 dark:bg-navy-700 rtl:text-right">
                  <thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-navy-800 dark:text-white">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Subject Code
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Total Booklets
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    {assignTask?.map((task) => {

                      return (
                        <tr class="bg-white dark:bg-navy-700 dark:text-white">
                          <td class="px-6 py-4">
                            {currentBookletDetails?.folderName}
                          </td>

                          <td class="px-6 py-4">
                            {task?.userId?.name?.toUpperCase()}
                          </td>
                          <td class="px-6 py-4">{task?.userId?.email}</td>
                          <td class="px-6 py-4">{task?.totalBooklets}</td>
                          <td class="px-6 py-4">{task?.status}</td>
                          <td class="px-6 py-4">
                            <button
                              className="rounded-md bg-green-500  text-white hover:bg-green-600"
                              onClick={() => downloadBooklet(task)}
                              disabled={downloadLoader}
                            >
                              {downloadLoader ? (
                                <div
                                className={`flex h-full w-full items-center justify-center p-2 rounded-md ${
                                  downloadLoader ? "bg-green-400" : "bg-green-600"
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
                                Downloading...
                              </div>
                              ) : (
                                <div className="p-2" >Download</div>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default AssignBookletModal;
