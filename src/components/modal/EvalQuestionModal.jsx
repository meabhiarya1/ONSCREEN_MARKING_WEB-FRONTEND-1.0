import { getSubjectIdImgUrl } from "components/Helper/Evaluator/EvalRoute";
import React, { useEffect, useState } from "react";
import { GiCrossMark } from "react-icons/gi";
import { useSelector } from "react-redux";
const EvalQuestionModal = ({ show, onHide }) => {
  const [currentQuestionImageIndex, setCurrentQuestionImageIndex] = useState(1);
  const [currentAnswerImageIndex, setCurrentAnswerImageIndex] = useState(1);
  const [questionsPdfPath, setQuestionsPdfPath] = useState(undefined);
  const [answersPdfPath, setAnswersPdfPath] = useState(undefined);
  const [countQuestions, setCountQuestions] = useState(0);
  const [countAnswers, setCountAnswers] = useState(0);

  const evaluatorState = useSelector((state) => state.evaluator);

  const currentTaskDetails = evaluatorState.currentTaskDetails;
  const currentQuestionDefinitionId =
    evaluatorState.currentQuestionDefinitionId;
  useEffect(() => {
    const fetchImgUrl = async () => {
      const response = await getSubjectIdImgUrl(
        currentTaskDetails.subjectSchemaRelationId
      );
      console.log(response);
    };
    if (currentTaskDetails) {
      fetchImgUrl();
    }
  }, [currentTaskDetails]);
  console.log(currentQuestionDefinitionId);
  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="scale-85 relative h-[95vh] w-[95vw] max-w-none transform bg-white p-8 shadow-2xl transition-all duration-300 dark:bg-navy-700 sm:scale-100">
        <button
          className="absolute right-4 top-4 text-2xl text-gray-700 hover:text-red-700 focus:outline-none"
          onClick={() => {
            onHide();
          }}
        >
          <GiCrossMark />
        </button>

        {/* Two Sections Side-by-Side */}
        <div className="grid h-full grid-cols-2 gap-4">
          {/* Left Section */}
          <div className="relative flex flex-col items-center justify-between overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-bold text-gray-800 dark:text-white">
                Questions Page
              </div>
            </div>
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/extractedAnswerPdfImages/1733822112065-CS603_1119_page-1/image_${currentQuestionImageIndex}.png`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                cursor: "pointer",
              }}
            />
            <div className="mt-4 flex items-center  justify-between gap-10">
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800">
                Previous
              </button>

              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800">
                Next
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative flex flex-col items-center justify-between overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-bold text-gray-800 dark:text-white">
                Answer Page
              </div>
            </div>
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/extractedAnswerPdfImages/1733822112065-CS603_1119_page-1/image_${currentAnswerImageIndex}.png`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                cursor: "pointer",
              }}
            />
            <div className="mt-4 flex items-center justify-between gap-10">
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800">
                Previous
              </button>

              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvalQuestionModal;
