import React, { useEffect, useState } from "react";
import { GiCrossMark } from "react-icons/gi";

const ClassModal = ({
  isOpen,
  setIsOpen,
  handleSubmit,
  formData,
  setFormData,
  loading
}) => {

  // Make state empty
  useEffect(()=>{
    if(isOpen){
      setFormData({
        className: "",
        classCode: "",
        duration: "",
        session: "",
        year: "",
      })
    }
  },[isOpen])
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300">
          <div className="relative w-full max-w-lg scale-95 transform rounded-lg bg-white pt-8 sm:p-8 shadow-lg transition-all duration-300 sm:scale-100 dark:bg-navy-700 dark:border dark:border-gray-400">
            <button
              className="absolute right-2 top-2 p-4 text-2xl text-gray-700 hover:text-red-700 focus:outline-none "
              onClick={() => {
                setIsOpen(false)
                setFormData({
                  className: "",
                  classCode: "",
                  duration: "",
                  session: "",
                  year: "",
                })
              }}
            >
              <GiCrossMark />
            </button>
            <form className="space-y-4 py-6 px-4 sm:p-4" onSubmit={handleSubmit}>
              <label
                htmlFor="class"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
              >
                <span className="text-xs font-medium text-gray-700 dark:text-white">
                  Class
                </span>
                <input
                  type="text"
                  id="class"
                  name="className"
                  placeholder="B.Tech / B.A etc"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm dark:bg-navy-700 dark:text-white"
                  value={formData.className}
                  onChange={handleChange}
                />
              </label>

              <label
                htmlFor="classCode"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
              >
                <span className="text-xs font-medium text-gray-700 dark:text-white">
                  Class Code
                </span>
                <input
                  type="text"
                  id="classCode"
                  name="classCode"
                  placeholder="Enter Class code"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm dark:bg-navy-700 dark:text-white"
                  value={formData.classCode}
                  onChange={handleChange}
                />
              </label>

              <div className="flex justify-between gap-4">
                <label
                  htmlFor="duration"
                  className="block  overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-white">
                    Duration
                  </span>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    placeholder="Enter duration"
                    className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm dark:bg-navy-700 dark:text-white"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </label>
                <label
                  htmlFor="session"
                  className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-white">
                    Session
                  </span>
                  <input
                    type="number"
                    id="session"
                    name="session"
                    placeholder="Enter session"
                    className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm dark:bg-navy-700 dark:text-white"
                    value={formData.session}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label
                htmlFor="year"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
              >
                <span className="text-xs font-medium text-gray-700 dark:text-white">
                  Year
                </span>
                <input
                  type="text"
                  id="year"
                  name="year"
                  placeholder="Enter year"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm dark:bg-navy-700 dark:text-white"
                  value={formData.year}
                  onChange={handleChange}
                />
              </label>

              {/* Submit Button */}
              {loading ? (
                <div
                  className={`flex h-full w-full items-center justify-center p-2 text-white ${
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
                <button
                  type="submit"
                  className="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-700 font-semibold"
                  disabled={loading}
                >
                  Submit
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassModal;
