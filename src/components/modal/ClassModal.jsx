import React, { useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ClassModal = ({ setIsOpen, isOpen }) => {
  const nameRef = useRef(null);
  const codeRef = useRef(null);
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Access values directly from refs
    const formData = {
      name: nameRef.current.value,
      code: codeRef.current.value,
      classId: id,
    };

    console.log(formData);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subjects/create/subject`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      toast.success("Class created successfully 🙂");
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
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
                htmlFor="name"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  {" "}
                  Course{" "}
                </span>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter Course Name"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  ref={nameRef} // Add ref
                />
              </label>

              <label
                htmlFor="code"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  {" "}
                  Subject / Course Code{" "}
                </span>
                <input
                  type="text"
                  id="code"
                  placeholder="Enter Subject / Course Code"
                  className="focus:border-transparent mt-1 w-full border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
                  ref={codeRef} // Add ref
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
