import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GiCrossMark } from "react-icons/gi";

const EditClassModal = ({
  isEditOpen,
  setEditIsOpen,
  currentClass,
  formData,
  setFormData,
  classes,
  setClasses,
}) => {
  const [loading, setLoading] = useState(false);

  // Populate formData when the modal opens with the current course data
  useEffect(() => {
    if (currentClass) {
      setFormData(currentClass);
    }
  }, [currentClass, setFormData, isEditOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically set the field value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData) {
      toast.warning("All the fields are required.");
      return;
    }

    if (
      !formData.className ||
      !formData.classCode ||
      !formData.duration ||
      !formData.session ||
      !formData.year
    ) {
      toast.warning("All the fields are required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/classes/update/classes/${currentClass._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the course in the courses state
      const updatedClasses = classes.map((class_) => {
        if (class_._id === response.data._id) {
          return response.data;
        }
        return class_;
      });
      setClasses(updatedClasses);
      setEditIsOpen(false);
      toast.success("Class updated successfully");
      setFormData({
        className: "",
        classCode: "",
        duration: "",
        session: "",
        year: "",
      });
      setEditIsOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isEditOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md transition-opacity duration-300">
          <div className="relative w-full max-w-lg scale-95 transform rounded-lg border border-b-gray-700 bg-white pt-8 sm:p-8 shadow-lg transition-all duration-300 dark:border dark:border-gray-400 dark:bg-navy-700 sm:scale-100">
            <button
              className="absolute right-2 top-2 p-2 text-2xl text-gray-700 hover:text-red-700 focus:outline-none"
              onClick={() => {
                setEditIsOpen(false);
                // setFormData({
                //   className: "",
                //   classCode: "",
                //   duration: "",
                //   session: "",
                //   year: "",
                // })
              }}
            >
              <GiCrossMark />
            </button>

            {/* Modal Content */}
            <form className="space-y-4 py-6 px-4 sm:p-4" onSubmit={handleSubmit}>
              <label
                htmlFor="class"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 dark:bg-navy-700"
              >
                <span className="text-xs font-medium text-gray-700 dark:text-white">
                  Class
                </span>
                <input
                  type="text"
                  id="class"
                  name="className"
                  placeholder="B.Tech / B.A etc"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 dark:bg-navy-700 dark:text-white sm:text-sm"
                  value={formData.className || ""} // Use formData instead of currentCourse
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
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 dark:bg-navy-700 dark:text-white sm:text-sm"
                  value={formData.classCode || ""}
                  onChange={handleChange}
                />
              </label>

              <div className="flex justify-between gap-4">
                <label
                  htmlFor="duration"
                  className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-white">
                    Duration
                  </span>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    placeholder="Enter duration"
                    className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 dark:bg-navy-700 dark:text-white sm:text-sm"
                    value={formData.duration || ""}
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
                    type="text"
                    id="session"
                    name="session"
                    placeholder="Enter session"
                    className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 dark:bg-navy-700 dark:text-white sm:text-sm"
                    value={formData.session || ""} // Use formData instead of currentCourse
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
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 dark:bg-navy-700 dark:text-white sm:text-sm"
                  value={formData.year || ""} // Use formData instead of currentCourse
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

export default EditClassModal;
