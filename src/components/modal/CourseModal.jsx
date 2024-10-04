import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const CourseModal = ({ isOpen, setIsOpen }) => {
  // Create refs for each input field
  const classNameRef = useRef(null);
  const classCodeRef = useRef(null);
  const durationRef = useRef(null);
  const sessionRef = useRef(null);
  const yearRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Access values directly from refs
    const formData = {
      className: classNameRef.current.value,
      classCode: classCodeRef.current.value,
      duration: durationRef.current.value,
      session: sessionRef.current.value,
      year: yearRef.current.value,
    };
    console.log(formData);

    try {
      const token = localStorage.getItem("token");
      const response = axios.post(
        `${process.env.REACT_APP_API_URL}/api/classes/create/class`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      toast.success("Course created successfully.");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 transition-opacity duration-300">
          <div className="relative w-full max-w-lg scale-95 transform rounded-lg bg-white p-8 shadow-lg transition-all duration-300 sm:scale-100">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>

            {/* Modal Content */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label
                htmlFor="class"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  {" "}
                  Class{" "}
                </span>
                <input
                  type="text"
                  id="class"
                  placeholder="B.Tech / B.A etc"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  ref={classNameRef} // Add ref
                />
              </label>

              <label
                htmlFor="classCode"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  {" "}
                  Class Code{" "}
                </span>
                <input
                  type="text"
                  id="classCode"
                  placeholder="Enter Class code"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  ref={classCodeRef} // Add ref
                />
              </label>

              <label
                htmlFor="duration"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  {" "}
                  Duration{" "}
                </span>
                <input
                  type="text"
                  id="duration"
                  placeholder="Enter duration"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  ref={durationRef} // Add ref
                />
              </label>

              <label
                htmlFor="session"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  {" "}
                  Session{" "}
                </span>
                <input
                  type="text"
                  id="session"
                  placeholder="Enter session"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  ref={sessionRef} // Add ref
                />
              </label>

              <label
                htmlFor="year"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  {" "}
                  Year{" "}
                </span>
                <input
                  type="text"
                  id="year"
                  placeholder="Enter year"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  ref={yearRef} // Add ref
                />
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseModal;
