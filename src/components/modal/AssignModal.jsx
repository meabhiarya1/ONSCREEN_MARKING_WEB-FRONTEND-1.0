import React from "react";

const AssignModal = ({ setShowAssignModal }) => {
  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50  ">
      <div className="mx-auto max-w-[800px] rounded-md bg-white shadow-lg drop-shadow-md rounded-xl">
        <div className="flex justify-between px-4 py-3">
          <div>
            <h2 className="font-bold" style={{ fontSize: "32px" }}>
              Sign Up
            </h2> 
            <p className="text-gray-500" style={{ fontSize: "15px" }}>
              It's quick and easy.
            </p>
          </div>
          <div
             
            className="text-gray-600 cursor-pointer"
            onClick={() => {
              setShowAssignModal(!setShowAssignModal);
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

        <div className="space-y-3 px-4 pb-6 pt-3">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="First name"
              className="text-md flex-1 rounded-md bg-gray-100 px-2 py-2 outline-none ring-1 ring-gray-400 focus:placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Surname"
              className="text-md flex-1 rounded-md bg-gray-100 px-2 py-2 outline-none ring-1 ring-gray-400 focus:placeholder-gray-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Mobile number or email address"
              className="text-md w-full rounded-md bg-gray-100 px-2 py-2 outline-none ring-1 ring-gray-400 focus:placeholder-gray-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="New password"
              className="text-md w-full rounded-md bg-gray-100 px-2 py-2 outline-none ring-1 ring-gray-400 focus:placeholder-gray-500"
            />
          </div>

          <div>
            <div className="text-gray-500" style={{ fontSize: "12px" }}>
              Date of birth <a href=""> (?) </a>
            </div>
            <div className="mt-1 flex space-x-3">
              <select
                name="day"
                className="text-md flex-1 rounded-md px-1 py-1.5 outline-none ring-1 ring-gray-400"
              >
                {[...Array(31).keys()].map((day) => (
                  <option key={day + 1}>{day + 1}</option>
                ))}
              </select>
              <select
                name="month"
                className="text-md flex-1 rounded-md px-1 py-1.5 outline-none ring-1 ring-gray-400"
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month}>{month}</option>
                ))}
              </select>
              <select
                name="year"
                className="text-md flex-1 rounded-md px-1 py-1.5 outline-none ring-1 ring-gray-400"
              >
                {Array.from({ length: 34 }, (_, i) => 1990 + i).map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="text-gray-500" style={{ fontSize: "12px" }}>
              Gender <a href=""> (?) </a>
            </div>
            <div className="mt-1 flex space-x-3">
              {["Female", "Male", "Custom"].map((gender) => (
                <label
                  key={gender}
                  htmlFor={gender.toLowerCase()}
                  className="flex flex-1 items-center justify-between space-x-2 rounded-md border border-gray-400 px-2 py-1"
                >
                  <span>{gender}</span>
                  <input type="radio" id={gender.toLowerCase()} name="gender" />
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-600" style={{ fontSize: "11px" }}>
              People who use our service may have uploaded your contact
              information to Facebook.
              <a
                href=""
                className="font-medium hover:text-blue-900 hover:underline"
              >
                Learn more
              </a>
              .
            </p>
            <p className="mt-4 text-gray-600" style={{ fontSize: "11px" }}>
              By clicking Sign Up, you agree to our
              <a
                href=""
                className="font-medium hover:text-blue-900 hover:underline"
              >
                Terms
              </a>
              ,
              <a
                href=""
                className="font-medium hover:text-blue-900 hover:underline"
              >
                Privacy Policy
              </a>
              and
              <a
                href=""
                className="font-medium hover:text-blue-900 hover:underline"
              >
                Cookies Policy
              </a>
              . You may receive SMS notifications from us and can opt out at any
              time.
            </p>
          </div>
          <div className="text-center">
            <button
              className="rounded-md px-16 py-1 font-bold text-white"
              style={{ backgroundColor: "#00A400", fontSize: "18px" }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
