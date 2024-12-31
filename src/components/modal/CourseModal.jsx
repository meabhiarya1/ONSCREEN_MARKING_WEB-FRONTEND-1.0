import React from "react";
import { GiCrossMark } from "react-icons/gi";

const CourseModal = ({
  setIsOpen,
  isOpen,
  handleSubmit,
  setFormData,
  formData,
}) => {

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-lg scale-95 transform rounded-lg bg-white p-8 shadow-2xl transition-all duration-300 sm:scale-100 dark:bg-navy-700">
            <button
              className="absolute right-4 top-4 text-2xl text-gray-700 hover:text-red-700 focus:outline-none"
              onClick={() => {
                setIsOpen(false);
                setFormData({
                  name: "",
                  code: "",
                });
              }}
            >
              <GiCrossMark />
            </button>

            {/* Modal Content */}
            <form className="space-y-6 p-4" onSubmit={handleSubmit}>
              <label
                htmlFor="name"
                className="block overflow-hidden rounded-md border border-gray-300 px-4 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
              >

                {/* <span className="text-xs font-medium text-gray-700">
                  Course
                </span> */}

                <span className="text-sm font-medium text-gray-800 dark:text-white">Course Name</span>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Course Name"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm dark:bg-navy-700 dark:text-white"
                  value={formData.name}
                  onChange={handleChange} // Handle changes
                />
              </label>

              <label
                htmlFor="code"
                className="block overflow-hidden rounded-md border border-gray-300 px-4 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-white">Course Code</span>
                <input
                  type="text"
                  id="code"
                  name="code"
                  placeholder="Enter Course Code"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm dark:bg-navy-700 dark:text-white"
                  value={formData.code}
                  onChange={handleChange} // Handle changes
                />
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
