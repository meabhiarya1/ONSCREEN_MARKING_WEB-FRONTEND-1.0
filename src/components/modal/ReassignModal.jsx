import React from "react";

const ReassignModal = ({ showReAssignModal, users, setShowReAssignModal }) => {
  return (
    <div>
      <div
        className={`bg-black fixed inset-0 ${
          !showReAssignModal ? "z-50" : "z-0"
        } flex items-center justify-center bg-opacity-50 backdrop-blur-md`}
      >
        <div className="mx-auto max-w-[800px]  rounded-xl bg-white shadow-lg drop-shadow-md">
          <div className="flex justify-between px-4 py-3">
            <div>
              <h2 className="font-bold" style={{ fontSize: "32px" }}>
                All Users
              </h2>
            </div>
            <div
              className="cursor-pointer text-gray-600"
              onClick={() => setShowReAssignModal(false)}
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
          <div className="mx-2 min-w-[400px] space-y-2 px-3 pb-6 pt-3 ">
            <div className="flex w-full flex-col space-y-2">
              <div className="flex">
                <select
                  name="HeadlineAct"
                  id="HeadlineAct"
                  className="mt-1.5 w-full rounded-lg border border-gray-300 p-2   text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs 
                  sm:text-sm justify-center items-center"
                >
                  {users.map((user) => (
                    <option>{user.email}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>{" "}
          <div class="mx-3 text-center">
            <button
              class="my-2 mb-3 w-full rounded-md px-16 py-1 text-lg font-bold text-white"
              style={{ backgroundColor: "#00A400" }}
              //   onClick={() => {
              //     setShowEditModal(false);
              //   }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReassignModal;
