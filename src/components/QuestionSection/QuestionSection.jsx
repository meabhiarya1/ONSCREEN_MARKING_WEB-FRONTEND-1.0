import React, { useEffect, useState } from "react";
import CustomAddButton from "UI/CustomAddButton";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getQuestionSchemaById } from "components/Helper/Evaluator/EvalRoute";
import { postMarkById } from "components/Helper/Evaluator/EvalRoute";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentIcon,
  setIsDraggingIcon,
  setCurrentQuestion,
  setCurrentMarkDetails,
  setCurrentTaskDetails,
  setCurrentQuestionDefinitionId,
} from "store/evaluatorSlice";
import { changeCurrentIndexById } from "components/Helper/Evaluator/EvalRoute";
import { setCurrentBookletIndex } from "store/evaluatorSlice";
const QuestionDefinition = (props) => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [allQuestions, setAllQuestions] = useState([]);
  const [rotationStates, setRotationStates] = useState({});
  const [marked, setMarked] = useState(false);
  const [totalMarks, setTotalMarks] = useState(null);
  const evaluatorState = useSelector((state) => state.evaluator);
  const taskDetails = evaluatorState.currentTaskDetails;
  const currentBookletIndex = evaluatorState.currentBookletIndex;
  const currentQuestion = evaluatorState.currentQuestion;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchQuestionDetails = async (answerPdfDetails) => {
      try {
        const response2 = await getQuestionSchemaById(
          answerPdfDetails.taskId,
          answerPdfDetails._id
        );
        console.log(response2);
        const reducedArr = response2.reduce((total, item) => {
          return total + item.allottedMarks;
        }, 0);
        setTotalMarks(reducedArr);
        // console.log(response2[currentQuestion]);
        dispatch(
          setCurrentQuestionDefinitionId(response2[currentQuestion - 1]._id)
        );
        setAllQuestions(response2);
      } catch (error) {
        console.log(error);
      }
    };

    if (props.answerPdfDetails) {
      fetchQuestionDetails(props.answerPdfDetails);
    }
  }, [props.answerPdfDetails, marked, evaluatorState.rerender]);

  const handleRotate = (index) => {
    setRotationStates({
      [index]: rotationStates[index] === 45 ? 0 : 45, // Toggle only the current index
    });
  };

  const generateNumbers = (minMarks, maxNumber, difference) => {
    const numbers = [];
    // Start from 1, then keep adding the difference until it exceeds maxNumber
    for (let i = minMarks; i <= maxNumber; i += difference) {
      numbers.push(i);
    }
    return numbers;
  };
  const handleListClick = async (item, mark, index) => {
    const { _id, answerPdfId, allottedMarks } = item;

    try {
      const body = {
        questionDefinitionId: _id,
        answerPdfId: answerPdfId,
        allottedMarks: +allottedMarks + +mark,
        timerStamps: new Date().toLocaleString(),
      };
      dispatch(setCurrentQuestionDefinitionId(_id));
      dispatch(setCurrentMarkDetails(body));
      dispatch(setCurrentIcon("/check.png"));
      dispatch(setIsDraggingIcon(true));
      dispatch(setCurrentQuestion(index + 1));
      // const response = await postMarkById(body);
      setMarked((prev) => !prev);
      setRotationStates({
        [index]: (rotationStates[index] = 0), // Toggle only the current index
      });
      // console.log(response);
    } catch (error) {}
    console.log(item, mark);
  };
  const QuestionData = allQuestions.map((item, index) => {
    const isRotated = rotationStates[index] === 45;
    const allotedMarks = item.allottedMarks;

    const marks = generateNumbers(
      item.minMarks,
      item.maxMarks,
      item.marksDifference
    );
    const background =
      selectedQuestion === index
        ? allotedMarks !== 0
          ? "bg-green-300"
          : "bg-red-300"
        : allotedMarks === 0
        ? "bg-red-100"
        : "bg-green-100";
    // const background =
    //   allotedMarks !== 0
    //     ? selectedQuestion === index
    //       ? "bg-green-300" // Marks allocated and index matches
    //       : "bg-green-100" // Marks allocated and index doesn't match
    //     : selectedQuestion === index
    //     ? "bg-green-300" // No marks allocated but index matches
    //     : "bg-red-100"; // No marks allocated and index doesn't match
    const handleAllotZeroListClick = async (item, mark, index) => {
      const { _id, answerPdfId, allottedMarks } = item;

      try {
        const body = {
          questionDefinitionId: _id,
          answerPdfId: answerPdfId,
          allottedMarks: 0,
          timerStamps: new Date().toLocaleString(),
        };
        dispatch(setCurrentMarkDetails(body));
        dispatch(setCurrentIcon("/close.png"));
        dispatch(setIsDraggingIcon(true));
        dispatch(setCurrentQuestion(index + 1));

        setMarked((prev) => !prev);
        setRotationStates({
          [index]: (rotationStates[index] = 0), // Toggle only the current index
        });
        // console.log(response);
      } catch (error) {}
      console.log(item, mark);
    };

    return (
      <tr
        className={`h-16 border    dark:border-gray-700   ${background} `}
        onClick={() => {
          setSelectedQuestion(index);
        }}
      >
        <th
          scope="row"
          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
        >
          Q{item.questionsName}
        </th>
        <td className=" px-2 py-3">
          <div className="relative flex flex-row rounded-lg border  px-1 py-1">
            <IconButton
              color={isRotated ? "warning" : "primary"}
              aria-label="add icon"
              onClick={() => handleRotate(index)}
              style={{
                transform: `rotate(${isRotated ? 45 : 0}deg)`,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <AddCircleOutlineIcon className="" />
            </IconButton>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={allotedMarks}
              type="text"
            />
            {/* Modal */}
            {isRotated && (
              <div
                className="absolute left--2 top-12 z-10 ml-2 w-24  rounded-md border border-gray-300 bg-white  shadow-lg"
                style={{
                  transform: "translateX(0)", // Position to the left of the button
                }}
              >
                <p className=" sticky top-0 bg-gray-200 text-center  text-sm text-gray-700">
                  {`Select Marks`}
                </p>
                <ul className=" h-full max-h-[300px]  overflow-y-auto text-sm text-gray-700">
                  {marks.map((mark, i) => {
                    return (
                      <li
                        onClick={() => handleListClick(item, mark, index)}
                        className="cursor-pointer border text-center hover:bg-gray-200 hover:text-blue-500" // Adds pointer cursor and hover effect
                        key={i}
                      >
                        {mark}
                      </li>
                    );
                  })}
                  <li
                    className="cursor-pointer border bg-gray-100 text-center font-bold hover:bg-gray-200 hover:text-red-500"
                    onClick={() => handleAllotZeroListClick(item, 0, index)} // Optional click action
                  >
                    Allot 0
                  </li>
                </ul>
              </div>
            )}
          </div>
        </td>
        {/* <td className="px-6 py-4">{item.minMarks}</td>
        <td className="px-6 py-4">{item.maxMarks}</td> */}
      </tr>
    );
  });

  const handleNextBooklet = async () => {
    try {
      if (currentBookletIndex < taskDetails.totalFiles) {
        const taskId = taskDetails._id;
        const response = await changeCurrentIndexById(
          taskId,
          taskDetails.currentFileIndex + 1
        );
        dispatch(setCurrentBookletIndex(response));
        // console.log(response);
      }
      // console.log(taskDetails);
      //
    } catch (error) {
      console.log(error);
    }
  };
  const handlePrevBooklet = async () => {
    try {
      if (currentBookletIndex > 1) {
        const taskId = taskDetails._id;
        const response = await changeCurrentIndexById(
          taskId,
          currentBookletIndex - 1
        );
        dispatch(setCurrentBookletIndex(currentBookletIndex - 1));
        console.log(response);
      }
      // console.log(taskDetails);
      //
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-[90vh]">
      <div className="flex h-[7%]">
        <buTton
          type="button"
          className="mb-2  w-[100%] bg-[#33597a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#26445e] focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={handlePrevBooklet}
        >
          {"<"} Prev Booklet
        </buTton>
        <buTton
          type="button"
          className="mb-2  w-[100%] bg-[#33597a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#26445e] focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={handleNextBooklet}
        >
          Next Booklet {">"}
        </buTton>
      </div>

      <div className="relative h-[73%] overflow-hidden shadow-md sm:rounded-lg">
        {/* Scrollable content */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          {" "}
          {/* Adjust height as needed */}
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Q.No
                </th>
                <th scope="col" className="px-6 py-3">
                  Alloted Marks
                </th>
              </tr>
            </thead>
            <tbody>{QuestionData}</tbody>
          </table>
        </div>
        {/* Footer always visible */}
        <div className="bg-white dark:bg-gray-800">
          <table className="w-full">
            <tfoot>
              <tr className="h-4 bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  TOTAL
                </th>
                <td className="px-2 py-3">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={totalMarks}
                    readOnly
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="my-2 mt-4">
        <button
          type="button"
          className="mb-2  w-[100%] border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
        >
          REJECT BOOKLET
        </button>
        <button
          type="button"
          className=" w-[100%]  border border-green-700 bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
        >
          SUBMIT BOOKLET
        </button>
      </div>
    </div>
  );
};

export default React.memo(QuestionDefinition);
