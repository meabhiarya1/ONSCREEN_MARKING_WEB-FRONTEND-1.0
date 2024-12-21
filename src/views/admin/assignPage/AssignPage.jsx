import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AssignModal from "components/modal/AssignModal";

const AssignPage = () => {
  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);

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

                <td className="whitespace-nowrap px-3 py-1.5 ">
                  <div class="flex h-full items-center justify-center gap-12">
                    <div class="from-stone-300/40 to-transparent rounded-[16px] bg-gradient-to-b p-[4px]">
                      <button
                        class="to-stone-200/40 group rounded-[12px] bg-gradient-to-b from-white p-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:scale-[0.995] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)]"
                        onClick={() => setShowAssignModal(!showAssignModal)}
                      >
                        <div class="from-stone-200/40 rounded-[8px] bg-gradient-to-b to-white/80 px-2 py-2">
                          <div class="flex items-center gap-2">
                            <span class="font-semibold">Assign Task</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      {showAssignModal && (
        <AssignModal
          showAssignModal={showAssignModal}
          setShowAssignModal={setShowAssignModal}
        />
      )}
    </div>
  );
};

export default AssignPage;
