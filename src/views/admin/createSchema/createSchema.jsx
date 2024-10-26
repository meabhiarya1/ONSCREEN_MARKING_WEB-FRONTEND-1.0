import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CreateSchema = () => {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [numQuestions, setNumQuestions] = useState("");
  const [rightClickDiv, setRightClickDiv] = useState(null); // For storing the div position and index
  const [divPosition, setDivPosition] = useState({ x: 0, y: 0 });
  const [subQuestionCounts, setSubQuestionCounts] = useState({}); // State to store sub-question counts for each question
  const [schemaData, setSchemaData] = useState();
  const { id } = useParams();
  const handleInputChange = (e) => {
    setNumQuestions(e.target.value);
  };

  const handleSubmit = () => {
    const parsedValue = parseInt(numQuestions, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setTotalQuestions(parsedValue);
    }
  };

  const handleRightClick = (index, e) => {
    e.preventDefault(); // Prevent the default right-click menu

    // Set the position relative to the card
    const card = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - card.left;
    const offsetY = e.clientY - card.top;

    setDivPosition({ x: offsetX, y: offsetY });
    setRightClickDiv({ index });
  };

  const handleClickOutside = (e) => {
    // Close the opened div if clicked outside
    if (!e.target.closest(".opened-div")) {
      setRightClickDiv(null); // Close the div
    }
  };

  const handleSubQuestionChange = (index, e) => {
    const value = parseInt(e.target.value, 10);

    setSubQuestionCounts((prev) => {
      if (!isNaN(value) && value > 0) {
        // If the value is a positive number, update the count for this question
        return {
          ...prev,
          [index]: value,
        };
      } else {
        // If the value is empty or invalid, remove the sub-question inputs for this question
        const { [index]: _, ...rest } = prev; // Remove the key for this question
        return rest;
      }
    });
  };

  // Add a click listener to close the div when clicking outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/schemas/get/schema/${id}`
        );
        setSchemaData(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, [id]);

  return (
    <div className="mt-6 h-[100%] px-2">
      <div className="m-4 flex justify-evenly rounded-md bg-blueSecondary p-4">
        <h2 className="px-4 text-xl font-medium text-white">
          Total number of Questions: {schemaData?.totalQuestions}
        </h2>

        <h2 className="px-4 text-xl font-medium text-white">
          Schema Name : {schemaData?.name}
        </h2>

        <h2 className="px-4 text-xl font-medium text-white">
          Maximum Marks : {schemaData?.maxMarks}
        </h2>

        <h2 className="px-4 text-xl font-medium text-white">
          Minimum Marks : {schemaData?.minMarks}
        </h2>
      </div>

      <div className="relative mt-3 px-4">
        {/* <input
          type="text"
          id="totalQuestions"
          value={numQuestions}
          onChange={handleInputChange}
          placeholder="Enter the total number of questions..."
          className="w-1/4 rounded-md border-gray-200 px-3 py-3 pe-10 shadow-sm sm:text-sm"
        /> */}

        {/* <div
          className="group mx-3 inline-block cursor-pointer rounded bg-blueSecondary text-white hover:bg-blue-700 focus:outline-none focus:ring active:text-opacity-75 "
          onClick={handleSubmit}
        > */}
        {/* <span className="group-hover:bg-transparent block rounded-sm px-8 py-3 text-sm font-medium">
            Submit
          </span> */}
        {/* </div> */}

        {/* <span className="absolute right-0 px-2 ">
          <button className="text-dark mr-5 inline-block rounded border border-green-700 px-10 py-3 text-sm font-medium hover:bg-green-700 hover:text-white focus:outline-none focus:ring active:bg-indigo-500">
            Create Schema
          </button>
        </span> */}
      </div>

      {/* Render the cards dynamically below */}
      <div className="custom-scrollbar mt-6 grid h-[calc(100%-134px)] w-full grid-flow-row-dense grid-cols-1 gap-4 overflow-x-auto overflow-y-auto px-4 pb-6 sm:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: schemaData?.totalQuestions }).map((_, index) => (
          <div
            key={index}
            className="relative h-[5rem] cursor-pointer rounded-lg bg-white p-4 shadow-md"
            onContextMenu={(e) => handleRightClick(index, e)} // Right-click event handler
          >
            <h2 className="mt-2 flex items-center justify-center text-xl font-semibold">
              Q. {index + 1}
            </h2>

            {/* Conditionally render the right-click div inside the card */}
            {rightClickDiv && rightClickDiv.index === index && (
              <div
                className="opened-div absolute z-50 cursor-pointer rounded-lg bg-indigo-400 p-4 shadow-md"
                style={{
                  top: `${divPosition.y}px`,
                  left: `${divPosition.x}px`,
                }}
              >
                <div className="flex w-[550px] gap-4">
                  <input
                    type="text"
                    placeholder="Primary Question Max Mark"
                    className="w-1/2 rounded-lg p-1.5 text-center"
                  />
                  <input
                    type="text"
                    placeholder="Minimum Evaluation Time"
                    className="w-1/2 rounded-lg p-1.5 text-center"
                  />
                </div>
                <div className="mt-3 flex w-full gap-4 ">
                  <input
                    type="text"
                    placeholder="Number of Sub-Questions"
                    className="w-full rounded-lg p-1.5 text-center"
                    onChange={(e) => handleSubQuestionChange(index, e)}
                  />
                </div>

                {/* Conditionally render sub-question inputs based on the count */}
                {subQuestionCounts[index] &&
                  Array.from({ length: subQuestionCounts[index] }).map(
                    (_, subIndex) => (
                      <div key={subIndex} className="mt-3 flex w-full gap-4">
                        <input
                          type="text"
                          placeholder={`Sub-Question Number`}
                          className="mt-2 w-full rounded-lg p-1.5 text-center"
                        />

                        <input
                          type="text"
                          placeholder={`Sub-Question Mark`}
                          className="mt-2 w-full rounded-lg p-1.5 text-center"
                        />

                        <input
                          type="text"
                          placeholder={`Bonus Marks`}
                          className="mt-2 w-full rounded-lg p-1.5 text-center"
                        />

                        <input
                          type="checkbox"
                          className="mt-2 w-[80px] cursor-pointer rounded-2xl text-center"
                        />
                      </div>
                    )
                  )}
                <div className="right-0 mt-4 flex cursor-pointer items-center justify-center rounded border border-indigo-800 px-8 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring active:bg-indigo-500">
                  Save
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateSchema;
