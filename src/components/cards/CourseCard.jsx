import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SelectSchemaModal from "components/modal/SelectSchemaModal";

const CourseCard = ({
  subject,
  setConfirmationModal,
  setSubjectId,
  setIsEditOpen,
  setCurrentSubject,
}) => {
  const { id } = useParams();
  const [classCourse, setClassCourse] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSubId, currentSetSubId] = useState("");

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

  const navigate = useNavigate();

  return (
    <div>
      <div
        key={subject?._id}
        className="block rounded-lg bg-white p-4 shadow-sm shadow-indigo-50 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-100 hover:shadow-lg dark:border-blue-300 dark:bg-navy-700 dark:text-white dark:shadow-gray-800 dark:hover:border"
      >
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
          <span className="flex flex-wrap items-center justify-evenly overflow-hidden rounded-md border bg-white shadow-sm dark:border-navy-600 dark:bg-navy-700">
            <button
              className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-amber-100 hover:text-amber-600 focus:relative focus:outline-none focus:ring-amber-300 dark:border-amber-500 dark:text-gray-400 dark:hover:bg-amber-800 dark:hover:text-amber-100 dark:focus:ring-amber-700"
              onClick={() => {
                setIsEditOpen(true);
                setCurrentSubject(subject);
              }}
            >
              Edit
            </button>

            <button
              className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-purple-100 hover:text-purple-600 focus:relative focus:outline-none focus:ring-purple-300 dark:border-purple-500 dark:text-gray-400 dark:hover:bg-purple-800 dark:hover:text-purple-100 dark:focus:ring-purple-700"
              onClick={() => {
                currentSetSubId(subject?._id);
                setShowModal(true);
              }}
            >
              Select Schema
            </button>

            <button
              className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-red-100 hover:text-red-600 focus:relative focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-gray-400 dark:hover:bg-red-800 dark:hover:text-red-100 dark:focus:ring-red-700"
              onClick={() => {
                setSubjectId(subject?._id);
                setConfirmationModal(true);
              }}
            >
              Delete
            </button>

            {/* <button
              className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-green-100 hover:text-green-600 focus:relative focus:outline-none focus:ring-green-300 dark:border-green-500 dark:text-gray-400 dark:hover:bg-green-800 dark:hover:text-green-100 dark:focus:ring-green-700"
              onClick={() => {
                setSubjectId(subject?._id);
                navigate(`/admin/subjects/${subject?._id}`);
              }}
            >
              Assign Page
            </button> */}
          </span>
        </div>
      </div>
      <SelectSchemaModal
        setShowModal={setShowModal}
        showModal={showModal}
        currentSubId={currentSubId}
      />
    </div>
  );
};

export default CourseCard;

// inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm dark:bg-navy-700 dark:border-navy-600
