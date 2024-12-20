import React, { useEffect, useState } from "react";
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

  //console.log(subjects);

  return (
    <div>
      {subjects.map((subject) => (
        <div
          className={
            showAssignModal
              ? "pointer-events-none blur-sm"
              : "mt-8 overflow-x-auto rounded-lg border border-gray-200"
          }
          key={subject._id}
        >
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-100 ltr:text-left rtl:text-right ">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Relation Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Count Answer Images
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Count Question Images
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {subject?.relationName}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {subject?.countOfAnswerImages}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {subject?.countOfQuestionImages}
                </td>
                <td className="whitespace-nowrap   px-4 py-2 ">
                  {subject?.status || "Not Assigned"}
                </td>
                <td className="relative whitespace-nowrap px-3 py-1.5">
                  {/* Drop Menu Buton*/}
                  <div
                    className="absolute right-2 top-1"
                    onClick={() => setShowDropDownModal(!showDropDownModal)}
                  >
                    <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
                      <button className="h-full p-1 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
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
                    className="absolute right-6 top-48 z-50 mt-2 w-36 rounded-md border border-gray-100 bg-white shadow-lg "
                    role="menu"
                  >
                    <div className="p-2">
                      <div
                        className="block   cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 "
                        role="menuitem"
                        onClick={() => {
                          setShowAssignModal(true);
                          setShowDropDownModal(!showDropDownModal);
                          setCurrentSubject(subject);
                        }}
                      >
                        Assign Task
                      </div>

                      <div
                        className="block  cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        role="menuitem"
                      >
                        Edit
                      </div>

                      <button
                        className="flex w-full cursor-pointer  items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        role="menuitem"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      ))}
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
