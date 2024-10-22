import React, { useState, useEffect } from "react";

const CreateSchema = () => {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [numQuestions, setNumQuestions] = useState("");
  const [rightClickDiv, setRightClickDiv] = useState(null); // For storing the div position and index
  const [divPosition, setDivPosition] = useState({ x: 0, y: 0 });

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

  // Add a click listener to close the div when clicking outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-6 px-2">
      <h1 className="text-2xl font-bold text-gray-700">
        Total number of Questions:
      </h1>

      <div className="relative mt-3 px-2">
        <input
          type="text"
          id="totalQuestions"
          value={numQuestions}
          onChange={handleInputChange}
          placeholder="Enter the total number of questions..."
          className="w-1/4 rounded-md border-gray-200 px-3 py-3 pe-10 shadow-sm sm:text-sm"
        />

        <div
          className="group mx-3 inline-block cursor-pointer rounded bg-gradient-to-r from-indigo-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75 "
          onClick={handleSubmit}
        >
          <span className="group-hover:bg-transparent block rounded-sm px-8 py-3 text-sm font-medium">
            Submit
          </span>
        </div>
      </div>

      {/* Render the cards dynamically below */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-y-auto h-[900px] pb-8 px-2 custom-scrollbar">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <div
            key={index}
            className="relative rounded-lg bg-white p-4 shadow-md"
            onContextMenu={(e) => handleRightClick(index, e)} // Right-click event handler
          >
            <h2 className="text-xl font-semibold">Question {index + 1}</h2>
            <p>Details for question {index + 1} go here.</p>

            {/* Conditionally render the right-click div inside the card */}
            {rightClickDiv && rightClickDiv.index === index && (
              <div
                className="opened-div absolute z-50 cursor-pointer rounded-lg bg-indigo-400 p-4 shadow-md"
                style={{
                  top: `${divPosition.y}px`,
                  left: `${divPosition.x}px`,
                }}
              >
                <p className="text-white">
                  Right-Clicked Div for Question {rightClickDiv.index + 1}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateSchema;
