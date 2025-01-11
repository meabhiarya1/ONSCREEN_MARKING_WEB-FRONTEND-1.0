import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AssignModal from "components/modal/AssignModal";

const AssignPage = () => {
  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDropDownModal, setShowDropDownModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });
  const dropdownRef = useRef(null);

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
        // console.log(response);
        setSubjects(response.data);
      } catch (error) {
        console.log("Error fetching images:", error);
        toast.error(`Error fetching images:${error}`);
      }
    };
    fetchedData();
  }, []);

  const handleDropdownClick = (event, subject) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: buttonRect.bottom + window.scrollY,
    });
    setCurrentSubject(subject);
    setShowDropDownModal(!showDropDownModal);
  };

  // console.log(currentSubject);

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
        </thead>{" "}
        {/* <div
            className={
              showAssignModal
                ? "pointer-events-none blur-sm"
                : "mt-0 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
            }
            key={subject._id}
          > */}
        {subjects.map(
          (subject) => (
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
                <td className="whitespace-nowrap   px-4 py-2 ">
                  {subject?.status || "Not Assigned"}
                </td>
                <td className="relative whitespace-nowrap px-3 py-1.5 text-right">
                  {/* Drop Menu Buton*/}
                  <div
                    onClick={(event) => {
                      setCurrentSubject(subject);
                      setShowDropDownModal(!showDropDownModal);
                      handleDropdownClick(event, subject);
                    }}
                  >
                    <div className="inline-flex cursor-pointer items-center overflow-hidden rounded-md border bg-white px-2 py-1 text-gray-700 dark:bg-navy-700 dark:text-white">
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
                  </div>{" "}
                </td>{" "}
                {/* Drop Menu */}
                {showDropDownModal && (
                  <div
                    className="absolute right-6 top-48 z-50 mt-2 w-36 rounded-md border border-gray-100 bg-white shadow-lg dark:bg-navy-700 dark:text-white"
                    ref={dropdownRef}
                    style={{
                      top: dropdownPosition.top,
                    }}
                    role="menu"
                  >
                    <div className="p-2">
                      <div
                        className="block   cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-navy-900 dark:hover:text-white"
                        role="menuitem"
                        onClick={() => {
                          setShowAssignModal(true);
                          setShowDropDownModal(!showDropDownModal);
                        }}
                      >
                        Assign Task
                      </div>

                      <div
                        className="block  cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-navy-900 dark:hover:text-white"
                        role="menuitem"
                      >
                        Edit
                      </div>

                      <button
                        className="flex w-full cursor-pointer  items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50 dark:hover:text-red-400"
                        role="menuitem"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </tr>
            </tbody>
          )
          // </div>
        )}
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
