import React, { useEffect } from "react";
import axios from "axios";
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
  // Populate formData when the modal opens with the current course data
  useEffect(() => {
    if (currentSubject) {
      setFormData(currentSubject);
    }
  }, [currentSubject, setFormData]);

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
    }
    setIsEditOpen(false);
  };

  return (
    <div>
      {isEditOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 transition-opacity duration-300">
          <div className="relative w-full max-w-lg scale-95 transform rounded-lg bg-white p-8 shadow-lg transition-all duration-300 sm:scale-100">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsEditOpen(false)}
            >
              ✖
            </button>

            {/* Modal Content */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label
                htmlFor="name"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Course
                </span>
                <input
                  type="text"
                  id="name"
                  name="name" // Bind name to the formData key
                  placeholder="Enter Course Name"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>

              <label
                htmlFor="code"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Subject / Course Code
                </span>
                <input
                  type="text"
                  id="code"
                  name="code" // Bind code to the formData key
                  placeholder="Enter Subject / Course Code"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  value={formData.code}
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

export default EditCourseModal;
