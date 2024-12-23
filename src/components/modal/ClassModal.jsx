import React from "react";
import { GiCrossMark } from "react-icons/gi";

const ClassModal = ({
  isOpen,
  setIsOpen,
  handleSubmit,
  formData,
  setFormData,
}) => {
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
          <div className="relative w-full max-w-lg scale-95 transform rounded-lg bg-white p-8 shadow-lg transition-all duration-300 sm:scale-100 dark:bg-navy-700 dark:border dark:border-gray-400">
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
            <form className="space-y-4 p-6" onSubmit={handleSubmit}>
              <label
                htmlFor="class"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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
                  className="block  overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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
                  className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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

export default ClassModal;
