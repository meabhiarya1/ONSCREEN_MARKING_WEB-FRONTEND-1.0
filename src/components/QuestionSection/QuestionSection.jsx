import React, { useEffect, useState } from "react";
import CustomAddButton from "UI/CustomAddButton";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getQuestionSchemaById } from "components/Helper/Evaluator/EvalRoute";
const QuestionDefinition = (props) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [rotationStates, setRotationStates] = useState({});
  useEffect(() => {
    if (props.questionDefinition.length !== 0) {
      setAllQuestions(props.questionDefinition);
    }
  }, [props.questionDefinition]);
  console.log(props);
  const handleRotate = (index) => {
    setRotationStates({
      [index]: rotationStates[index] === 45 ? 0 : 45, // Toggle only the current index
    });
  };

  const generateNumbers = (maxNumber, difference) => {
    const numbers = [];
    // Start from 1, then keep adding the difference until it exceeds maxNumber
    for (let i = 1; i <= maxNumber; i += difference) {
      numbers.push(i);
    }

    return numbers;
  };
  const QuestionData = allQuestions.map((item, index) => {
    const isRotated = rotationStates[index] === 45;
    const marksDifference = item.marksDifference;
    console.log(marksDifference);
    const marks = generateNumbers(item.maxMarks, item.marksDifference);
    console.log(marks);
    return (
      <tr className="h-16 border-b bg-white dark:border-gray-700 dark:bg-gray-800">
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
              type="text"
            />
            {/* Modal */}
            {isRotated && (
              <div
                className="absolute left-8 top-0 z-10 ml-2 max-h-[300px] w-40 overflow-y-auto rounded-lg border border-gray-300 bg-white  shadow-lg"
                style={{
                  transform: "translateX(0)", // Position to the left of the button
                }}
              >
                <p className="bg-gray-200  text-sm text-gray-700">
                  {`Select Marks(Diff:${marksDifference})`}
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {marks.map((mark, i) => {
                    return <li key={i}> {mark}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4">{item.minMarks}</td>
        <td className="px-6 py-4">{item.maxMarks}</td>
      </tr>
    );
  });
  return (
    <div className="h-[90vh]">
      <buTton
        type="button"
        className="mb-2 h-[7%] w-[100%] bg-[#33597a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#26445e] focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Next Booklet
      </buTton>

      <div className="relative h-[73%] overflow-x-auto shadow-md   sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Q.No
              </th>

              <th scope="col" className="px-6 py-3">
                Alloted Marks
              </th>
              <th scope="col" className="px-6 py-3">
                Min Marks
              </th>
              <th scope="col" className="px-6 py-3">
                Max Marks
              </th>
            </tr>
          </thead>
          <tbody className=" overflow-auto">
            {QuestionData}
            <hr />
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
                />
              </td>
              <td className="px-6 py-4"></td>
            </tr>
          </tbody>
        </table>
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
