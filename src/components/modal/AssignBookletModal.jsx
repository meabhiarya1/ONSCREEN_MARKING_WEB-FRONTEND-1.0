import React, { useEffect, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { getAllUsers } from "../../services/common";
import axios from "axios";
import { toast } from "react-toastify";

const AssignBookletModal = ({
  setShowAssignBookletModal,
  currentBookletDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

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

  const handleSubmitButton = async () => {
    try {
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
      console.log("Task created successfully:", response.data);
      toast.success("Task created successfully!");
    } catch (error) {
      console.log(error);
      // Display a proper error message if the server responds with an error
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      {" "}
      <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
        <div className="mx-3 w-full rounded-xl bg-white shadow-lg drop-shadow-md dark:bg-navy-700 dark:text-white sm:mx-6 md:w-2/3 lg:w-7/12 2xl:w-5/12">
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
          {/* Assign task details */}
          <div className=" ">
            {" "}
            <div className="relative">
              <div className="mt-5 flex items-center gap-4 px-4 text-gray-700 3xl:gap-9">
                <label className="font-bold  "> Subject Code:</label>{" "}
                {currentBookletDetails.folderName}
              </div>
            </div>
          </div>{" "}
          {/* select user dropdown */}
          <div className="mt-2 space-y-2 px-3 pb-6 pt-3">
            {" "}
            <div className="relative">
              {/* Dropdown Of users */}
              <div className="mt-5 flex items-center gap-4 px-1 3xl:gap-9">
                <div className="inline-block text-gray-700 dark:text-white">
                  <label htmlFor="" className="font-bold  ">
                    Select User:
                  </label>
                </div>
                <div className="w-4/5 ">
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
                        <option key={user._id} value={user._id}>
                          {user.email}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Dropdown Of users */}
            </div>
          </div>{" "}
          {/* submit */}
          <div class="px-20 py-3 text-center">
            <button
              class={`my-2 mb-3 w-full rounded-md py-1 text-lg font-bold text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={handleSubmitButton}
              disabled={loading}
            >
              {loading ? (
                <div className={`flex w-full items-center justify-center`}>
                  <MoonLoader color="white" loading={loading} size={20} />{" "}
                  <span className="ml-3">Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default AssignBookletModal;
