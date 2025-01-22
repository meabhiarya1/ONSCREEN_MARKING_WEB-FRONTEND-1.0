import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsArrowRepeat } from "react-icons/bs";
import { MdEditSquare } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";
import EditAssingModal from "components/modal/EditAssingModal";
import { getAllUsers } from "services/common";
import ReassignModal from "components/modal/ReassignModal";
import DeleteConfirmationModalAssignTask from "components/modal/DeleteConfirmationModalAssignTask";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({});
  const [showReAssignModal, setShowReAssignModal] = useState(false);
  const [deleteAssignModal, setDeleteAssign] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });

  // Function to handle task update after it's submitted from the child modal
  // Update the task in the parent state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/tasks/get/all/tasks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTasks(response?.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(localStorage.getItem("token"));
        setUsers(
          response.filter(
            (user) => user.role === "moderator" || user.role === "evaluator"
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [setShowEditModal, setShowReAssignModal]);

  useEffect(() => {
    setFilteredTasks(
      selectedUser === undefined
        ? tasks
        : tasks.filter((task) => task.userId?.email === selectedUser.email)
    );
  }, [selectedUser, tasks, setFilteredTasks]);

  const updateTaskInParent = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  return (
    <div className=" h-[650px] rounded-lg bg-lightPrimary px-4 py-2 dark:bg-navy-900">
      <div className="mt-8 flex items-center justify-end gap-4">
        <select
          name="HeadlineAct"
          id="HeadlineAct"
          className="mt-1.5 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-700 dark:text-white sm:text-sm"
          onChange={(e) =>
            setSelectedUser(users.find((user) => user.email === e.target.value))
          }
        >
          {" "}
          <option
            value=""
            selected
            className="my-4 cursor-pointer rounded-lg bg-gray-200 text-gray-700"
            style={{ cursor: "pointer" }}
          >
            {" "}
            Select User
          </option>
          {users.map((user) => (
            <option
              // value={selectedUser?.email}
              key={user?._id}
              className="my-4 rounded-lg bg-gray-200 py-2 text-gray-700"
              style={{ cursor: "pointer" }}
            >
              {" "}
              {user?.email}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 rounded-md bg-white text-sm dark:divide-gray-700 dark:bg-navy-700 dark:text-white">
            <thead className="bg-gray-100 dark:bg-navy-800 ltr:text-left rtl:text-right">
              <tr>
                {/* <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Task Name
                </th> */}
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Subject Code
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Total Files
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Assigned To
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"></th>
              </tr>
            </thead>
            {filteredTasks.map((filteredTask) => (
              <tbody
                className="divide-y divide-gray-200"
                key={filteredTask?._id}
              >
                <tr className="odd:bg-white dark:bg-navy-700">
                  {/* <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {filteredTask?.taskName}
                  </td> */}
                  <td className="whitespace-nowrap px-4 py-2  font-medium text-gray-700 dark:text-white">
                    {filteredTask?.subjectCode}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2  font-medium text-gray-700 dark:text-white">
                    {filteredTask?.userId?.name}
                  </td>
                  {/* <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {filteredTask?.className}
                  </td> */}
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {filteredTask?.totalBooklets}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {filteredTask?.userId?.email}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-2 font-semibold text-gray-700 ${
                      filteredTask?.status === false
                        ? "text-red-600"
                        : "text-green-600"
                    } `}
                  >
                    {filteredTask?.status === false ? "Pending" : "Completed"}
                  </td>
                  <td className="relative">
                    <button
                      className="mx-2 mt-2 rounded-full text-gray-600 transition-all duration-200 ease-in-out hover:rotate-180 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:hover:text-gray-50"
                      onClick={(e) => {
                        const buttonRect = e.target.getBoundingClientRect();
                        setModalPosition({
                          top: buttonRect.bottom + window.scrollY,
                          right: 30,
                        });
                        setShowTaskModal(!showTaskModal);
                        setCurrentTask(filteredTask);
                      }}
                    >
                      <svg
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                    </button>
                    {/* Dropdown */}
                  </td>{" "}
                  {showTaskModal && (
                    <div
                      style={{
                        position: "absolute",
                        top: modalPosition.top,
                        right: modalPosition.right,
                        zIndex: 50,
                        width: "200px",
                      }}
                      className="flex flex-col items-center justify-center gap-1 rounded-md bg-white px-4 py-5 shadow-lg dark:bg-navy-700"
                    >
                      <label
                        htmlFor="html"
                        className="hover:bg-zinc-100 relative flex h-10 w-full cursor-pointer select-none items-center justify-between gap-1 rounded-lg bg-gray-100 px-3 font-medium hover:bg-gray-600 peer-checked:bg-blue-50 peer-checked:text-blue-500 peer-checked:ring-1 peer-checked:ring-blue-300 dark:bg-navy-900 dark:hover:hover:bg-gray-700"
                        onClick={() => {
                          setShowReAssignModal(true);
                          setShowTaskModal(false);
                        }}
                      >
                        <div>Re Assign</div>
                        <BsArrowRepeat className="m-2 text-lg " />
                      </label>
                      <label
                        htmlFor="css"
                        className="hover:bg-zinc-100 relative flex h-10 w-full cursor-pointer select-none items-center justify-between gap-1 rounded-lg bg-gray-100 px-3 font-medium hover:bg-indigo-600 hover:text-white peer-checked:bg-blue-50 peer-checked:text-blue-500 peer-checked:ring-1 peer-checked:ring-blue-300 dark:bg-navy-900 dark:hover:hover:bg-indigo-600"
                        onClick={() => {
                          setShowEditModal(true);
                          setShowTaskModal(false);
                        }}
                      >
                        <div>Edit</div>
                        <MdEditSquare className="m-2 text-lg" />
                      </label>
                      <label
                        htmlFor="javascript"
                        className="hover:bg-zinc-100 relative flex h-10 w-full cursor-pointer select-none items-center justify-between gap-1 rounded-lg bg-gray-100 px-3 font-medium hover:bg-red-600 hover:text-white peer-checked:bg-blue-50 peer-checked:text-blue-500 peer-checked:ring-1 peer-checked:ring-blue-300 dark:bg-navy-900 dark:hover:hover:bg-red-600"
                        onClick={() => {
                          setDeleteAssign(true);
                        }}
                      >
                        <div>Delete</div>
                        <MdAutoDelete className="m-2 text-lg " />
                      </label>
                    </div>
                  )}
                </tr>
              </tbody>
            ))}
          </table>
          {showEditModal && (
            <EditAssingModal
              setShowEditModal={setShowEditModal}
              currentTask={currentTask}
              setShowTaskModal={setShowTaskModal}
              setCurrentTask={setCurrentTask}
              updateTaskInParent={updateTaskInParent}
            />
          )}

          {showReAssignModal && (
            <ReassignModal
              setShowReAssignModal={setShowReAssignModal}
              showReAssignModal={showReAssignModal}
              users={users}
            />
          )}

          {deleteAssignModal && (
            <DeleteConfirmationModalAssignTask
              setDeleteAssign={setDeleteAssign}
              currentTask={currentTask}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
