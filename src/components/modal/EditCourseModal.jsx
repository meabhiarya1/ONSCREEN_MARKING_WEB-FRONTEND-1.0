import React, { useEffect } from "react";
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-xl transform transition-all duration-500 scale-95 sm:scale-100 dark:bg-navy-700">
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
            <form className="space-y-6" onSubmit={handleSubmit}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Course Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Course Name"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                value={formData.name}
                onChange={handleChange}
              />

              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Subject / Course Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="Enter Subject / Course Code"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                value={formData.code}
                onChange={handleChange}
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
