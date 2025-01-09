import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AssignModal from "components/modal/AssignModal";

const AssignPage = () => {

  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDropDownModal, setShowDropDownModal] = useState(null); // Tracks the active dropdown
  const [currentSubject, setCurrentSubject] = useState(null);
  const dropdownRef = useRef({}); // Ref for tracking dropdown positions

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/relations/getallsubjectschemarelationstatustrue/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubjects(response.data);
      } catch (error) {
        console.log("Error fetching images:", error);
        toast.error(`Error fetching images: ${error}`);
      }
    };
    fetchedData();
  }, [id]);

  const handleDropdownToggle = (subjectId, event) => {
    event.stopPropagation(); // Prevent event bubbling
    const dropdownButton = event.currentTarget;
    const rect = dropdownButton.getBoundingClientRect();

    // Store position for the dropdown
    dropdownRef.current[subjectId] = {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    };

    setShowDropDownModal((prev) => (prev === subjectId ? null : subjectId));
  };

  return (
    <div>
      <table className="mt-8 min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:bg-navy-700 dark:text-white">
        <thead className="bg-gray-100 dark:bg-navy-900 ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              Relation Name
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              Answer Images
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              Question Images
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              Status
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"></th>
          </tr>
        </thead>

        {subjects.map((subject) => (
          <tbody className="divide-y divide-gray-200" key={subject._id}>
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                {subject?.relationName}
              </td>
              <td className="whitespace-nowrap px-14 py-2 text-gray-700 dark:text-white">
                {subject?.countOfAnswerImages}
              </td>
              <td className="whitespace-nowrap px-14 py-2 text-gray-700 dark:text-white">
                {subject?.countOfQuestionImages}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                {subject?.status || "Not Assigned"}
              </td>
              <td className="relative whitespace-nowrap px-3 py-1.5 text-right">
                {/* Drop Menu Button */}
                <div
                  onClick={(event) => handleDropdownToggle(subject._id, event)}
                  className="inline-flex cursor-pointer items-center overflow-hidden rounded-md border bg-white px-2 py-1 text-gray-700 dark:bg-navy-700 dark:text-white"
                >
                  Select
                  <button className="h-full p-1 text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-white dark:hover:bg-navy-700">
                    <span className="sr-only">Menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            {/* Drop Menu */}
            {showDropDownModal === subject._id && (
              <div
                className="absolute z-50 mt-2 w-36 rounded-md border border-gray-100 bg-white shadow-lg dark:bg-navy-800 dark:text-white"
                role="menu"
                style={{
                  top: dropdownRef.current[subject._id]?.top,
                  right: 20,
                  position: "absolute",
                }}
              >
                <div className="p-2">
                  <div
                    className="block cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-navy-900 dark:hover:text-white"
                    role="menuitem"
                    onClick={() => {
                      setShowAssignModal(true);
                      setShowDropDownModal(null);
                      setCurrentSubject(subject);
                    }}
                  >
                    Assign Task
                  </div>

                  <div
                    className="block cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-navy-900 dark:hover:text-white"
                    role="menuitem"
                  >
                    Edit
                  </div>

                  <button
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50 dark:hover:text-red-400"
                    role="menuitem"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </tbody>
        ))}
      </table>

      {showAssignModal && (
        <AssignModal
          showAssignModal={showAssignModal}
          setShowAssignModal={setShowAssignModal}
          currentSubject={currentSubject}
        />
      )}
    </div>
  );
};

export default AssignPage;