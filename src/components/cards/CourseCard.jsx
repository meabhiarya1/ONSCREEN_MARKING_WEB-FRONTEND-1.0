import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const CourseCard = ({ subject, handleDelete }) => {
  const { id } = useParams(); // Get the id from the URL
  const [classCourse, setClassCourse] = useState([]);

  useEffect(() => {
    const fetchedData = async () => {
      let token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/classes/getbyid/class/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        setClassCourse(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, []);

  return (
    <div
      key={subject?._id}
      className="block rounded-lg p-4 shadow-sm shadow-indigo-100"
    >
      <img
        alt=""
        src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        className="h-56 w-full rounded-md object-cover"
      />

      <div className="mt-2">
        <dl>
          <div className="mt-2 text-lg font-medium">
            {subject.name} ({subject?.code})
          </div>
        </dl>

        <div className="mt-6 flex items-center gap-8 text-xs">
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <svg
              className="size-4 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>

            <div className="mt-1.5 sm:mt-0">
              <p className="text-lg text-gray-500">
                Class : {classCourse?.className}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
          <button className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative">
            Edit
          </button>

          <button
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            onClick={() => {
              handleDelete(subject?._id);
            }}
          >
            Delete
          </button>
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
