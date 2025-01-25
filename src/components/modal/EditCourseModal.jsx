import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiCrossMark } from "react-icons/gi";
import { toast } from "react-toastify";

const EditCourseModal = ({
  isEditOpen,
  setIsEditOpen,
  currentSubject,
  formData,
  setFormData,
  courses,
  setCourses,
}) => {

  const [loading, setLoading] = useState(false);
  
  // Populate formData when the modal opens with the current course data
  useEffect(() => {
    if (currentSubject) {
      setFormData(currentSubject);
    }
  }, [currentSubject, setFormData,isEditOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically set the field value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/subjects/update/subject/${currentSubject._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the course in the courses state
      const updatedCourses = courses.map((course) => {
        if (course._id === response.data._id) {
          return response.data;
        }
        return course;
      });
      setCourses(updatedCourses);

      toast.success("Class updated successfully");
      setIsEditOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    setIsEditOpen(false);
  };


  return (
    <div>
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm">
          <div className="relative w-full max-w-lg pt-8 sm:p-8 bg-white rounded-lg shadow-xl transform transition-all duration-500 scale-95 sm:scale-100 dark:bg-navy-700">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-red-700 focus:outline-none transition-colors duration-300"
              onClick={() => {
                setIsEditOpen(false)
                // setFormData({
                //   name: "",
                //   code: "",
                // })
              }}
            >
              <GiCrossMark />
            </button>

            {/* Modal Content */}
            <form className="space-y-4 py-6 px-4 sm:p-4" onSubmit={handleSubmit}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Course Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Course Name"
                className="mt-2 w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
                value={formData.name}
                onChange={handleChange}
              />

              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Subject / Course Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="Enter Subject / Course Code"
                className="mt-2 w-full px-4 py-2 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
                value={formData.code}
                onChange={handleChange}
              />

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

export default EditCourseModal;
