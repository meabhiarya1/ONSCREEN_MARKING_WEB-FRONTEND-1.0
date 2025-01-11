import { getSubjectIdImgUrl } from "components/Helper/Evaluator/EvalRoute";
import React, { useEffect, useState } from "react";
import { GiCrossMark } from "react-icons/gi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const EvalQuestionModal = ({ show, onHide }) => {
  const [questionsPdfPath, setQuestionsPdfPath] = useState(undefined);
  const [answersPdfPath, setAnswersPdfPath] = useState(undefined);
  const [questionImages, setQuestionImages] = useState([]);
  const [answerImages, setAnswerImages] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState(0);
  const [currentAnswers, setCurrrentAnswers] = useState(0);

  const evaluatorState = useSelector((state) => state.evaluator);

  const currentTaskDetails = evaluatorState.currentTaskDetails;
  const currentQuestionDefinitionId =
    evaluatorState.currentQuestionDefinitionId;
  useEffect(() => {
    const fetchImgUrl = async () => {
      const response = await getSubjectIdImgUrl(
        currentTaskDetails.subjectSchemaRelationId,
        currentQuestionDefinitionId
      );
      const { subjectSchemaRelation, coordinateDetails } = response;
      if (subjectSchemaRelation && coordinateDetails) {
        setQuestionsPdfPath(subjectSchemaRelation.questionPdfPath);
        setAnswersPdfPath(subjectSchemaRelation.answerPdfPath);
        setQuestionImages(coordinateDetails[0].questionImages);
        setAnswerImages(coordinateDetails[0].answerImages);
      }
    };

    if (currentTaskDetails) {
      fetchImgUrl();
    }
  }, [currentTaskDetails]);
  console.log(questionImages, currentQuestions);
  const prevQuestionHandler = () => {
    const toastId = "firstPageWarning";
    if (currentQuestions > 0) {
      setCurrentQuestions(currentQuestions - 1);
    } else {
      toast.warn("You are already on the first page!", { toastId });
    }
  };
  const nextQuestionHandler = () => {
    const toastId = "lastPageWarning";
    if (currentQuestions < questionImages.length - 1) {
      setCurrentQuestions(currentQuestions + 1);
    } else {
      toast.warn("last page reached", { toastId });
    }
  };

  const prevAnswerHandler = () => {
    const toastId = "firstPageWarning";
    if (currentAnswers > 0) {
      setCurrrentAnswers(currentAnswers - 1);
    } else {
      toast.warn("You are already on the first page!", { toastId });
    }
  };
  const nextAnswerHandler = () => {
    const toastId = "lastPageWarning";
    if (currentAnswers < answerImages.length - 1) {
      setCurrrentAnswers(currentAnswers + 1);
    } else {
      toast.warn("last page reached", { toastId });
    }
  };

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
          <div className="relative flex h-full flex-col items-center justify-between overflow-y-auto rounded-lg border border-gray-300 bg-gray-600 p-6 shadow-lg">
            <div className=" sticky top-0 flex items-center justify-between ">
              <div className=" text-lg font-bold text-gray-800 dark:text-white">
                Questions Page
              </div>
            </div>
            {/* <div className="flex h-[70vh] w-full items-center justify-center overflow-y-auto "> */}
            {questionsPdfPath && questionImages.length > 0 && (
              <img
                src={`${process.env.REACT_APP_API_URL}/uploadedPdfs/extractedQuestionPdfImages/${questionsPdfPath}/${questionImages[currentQuestions]}`}
                // className=" max-w-full max-h-full object-cover"
                alt="question pdf"
              />
            )}
            {/* </div> */}
            <div className="sticky bottom-0 mt-4 flex items-center justify-between gap-10">
              <button
                onClick={prevQuestionHandler}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
                Previous
              </button>

              <button
                onClick={nextQuestionHandler}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative flex flex-col items-center justify-between overflow-y-auto rounded-lg border border-blue-300 bg-gray-600  p-6 shadow-lg">
            <div className="sticky top-0  mb-4 flex items-center justify-between">
              <div className="text-lg font-bold text-gray-800 dark:text-white">
                Answer Page
              </div>
            </div>
            <img
              src={`${process.env.REACT_APP_API_URL}/uploadedPdfs/extractedAnswerPdfImages/${answersPdfPath}/${answerImages[currentAnswers]}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                cursor: "pointer",
              }}
              alt="answer pdf"
            />
            <div className="sticky bottom-0 mt-4 flex items-center justify-between gap-10">
              <button
                onClick={prevAnswerHandler}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
                Previous
              </button>

              <button
                onClick={nextAnswerHandler}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
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
