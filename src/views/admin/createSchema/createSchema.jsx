import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { LineCapStyle } from "pdf-lib";

const CreateSchema = () => {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [numQuestions, setNumQuestions] = useState("");
  const [rightClickDiv, setRightClickDiv] = useState(null);
  const [divPosition, setDivPosition] = useState({ x: 0, y: 0 });
  const [subQuestionCounts, setSubQuestionCounts] = useState({});
  const [schemaData, setSchemaData] = useState();
  const [combinedData, setCombinedData] = useState(null);
  const [showCanvasOverlay, setShowCanvasOverlay] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingQuestion, setDraggingQuestion] = useState(null); // Tracks the current question being dragged
  const [activeDiv, setActiveDiv] = useState(null); // Tracks the active div
  const [createdDivs, setCreatedDivs] = useState([]); // Store dynamically created divs
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const { id } = useParams();
  const location = useLocation();

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
    e.preventDefault();
    const card = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - card.left;
    const offsetY = e.clientY - card.top;

    setDivPosition({ x: offsetX, y: offsetY });
    setRightClickDiv({ index });
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".opened-div")) {
      // setRightClickDiv(null);
    }
  };

  const handleSubQuestionChange = (index, e) => {
    const value = parseInt(e.target.value, 10);

    setSubQuestionCounts((prev) => {
      if (!isNaN(value) && value > 0) {
        return {
          ...prev,
          [index]: value,
        };
      } else {
        const { [index]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleShowImages = (index) => {
    // setCurrentImageIndex(index);
    setShowCanvasOverlay(true);
  };

  const handleCloseCanvas = () => {
    setShowCanvasOverlay(false);
    // setCurrentImageIndex(null);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % combinedData?.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? combinedData?.images.length - 1 : prevIndex - 1
    );
  };

  const handleMouseDown = (index, e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - card.left;
    const offsetY = e.clientY - card.top;
    const newDiv = {
      x: offsetX,
      y: offsetY,
      parentIndex: index,
    };

    setCreatedDivs((prev) => [...prev, newDiv]);
    setActiveDiv(newDiv);
  };

  const handleMouseUp = () => {
    setDraggingQuestion(null); // Remove the active question
    setActiveDiv(null);
  };

  const handleMouseMove = (index, e) => {
    setDraggingQuestion(index); // Mark the current question as active
    if (draggingQuestion !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      setCoordinates({ x: offsetX, y: offsetY });
      // console.log(`Dragging Question ${draggingQuestion + 1}`);
      // console.log(`Coordinates: X=${offsetX}, Y=${offsetY}`);
    }
  };

  useEffect(() => {
    if (showCanvasOverlay && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [showCanvasOverlay, canvasRef, combinedData]);

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

  useEffect(() => {
    if (location.state) {
      setCombinedData(location.state);
    }
  }, [location.state]);

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
        <div className="custom-scrollbar mt-6 grid h-[calc(100vh-280px)] w-full grid-flow-row-dense grid-cols-1 gap-4 overflow-x-auto overflow-y-auto px-4 pb-6 sm:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: schemaData?.totalQuestions }).map(
            (_, index) => (
              <div
                key={index}
                className="relative h-[5rem] cursor-pointer rounded-lg bg-white p-4 shadow-md"
                onContextMenu={(e) => handleRightClick(index, e)}
              >
                <h2 className="mt-2 flex items-center justify-center text-xl font-semibold">
                  Q. {index + 1}
                </h2>

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
                      <button
                        type="text"
                        className="w-1/3 rounded-lg bg-blueSecondary p-1.5 text-center font-semibold text-white"
                        onClick={() => handleShowImages(index)}
                      >
                        Show Images
                      </button>
                    </div>
                    <div className="mt-3 flex w-full gap-4">
                      <input
                        type="text"
                        placeholder="Number of Sub-Questions"
                        className="w-full rounded-lg p-1.5 text-center"
                        onChange={(e) => handleSubQuestionChange(index, e)}
                      />
                    </div>
                    {subQuestionCounts[index] &&
                      Array.from({ length: subQuestionCounts[index] }).map(
                        (_, subIndex) => (
                          <div
                            key={subIndex}
                            className="mt-3 flex w-full gap-4"
                          >
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
            )
          )}
        </div>
      </div>

      {showCanvasOverlay && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div
            className="relative h-[850px] w-[700px] rounded-lg bg-white p-6 shadow-lg "
            style={{ maxWidth: "700px", maxHeight: "850px" }}
          >
            <span className="absolute top-3 font-bold text-gray-600 dark:text-gray-400 ">
              {currentImageIndex + 1} / {combinedData?.images.length}
            </span>
            {/* Close button */}
            <button
              className="absolute right-2 top-2 text-2xl font-bold text-gray-600 hover:text-gray-900"
              onClick={() => setShowCanvasOverlay(false)}
            >
              &times;
            </button>
            {/* Image Display */}
            <img
              src={combinedData?.images[currentImageIndex]}
              alt={`Slide ${currentImageIndex + 1}`}
              className={`mb-1 h-[750px] w-full rounded-lg object-contain ${
                draggingQuestion === rightClickDiv.index
                  ? "border-4 border-blue-500"
                  : "bg-white"
              }`}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              onMouseDown={(e) => handleMouseDown(rightClickDiv.index, e)}
              onMouseMove={(e) => handleMouseMove(rightClickDiv.index, e)}
              onMouseUp={handleMouseUp}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevImage}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
                Previous
              </button>

              {/* Buttons */}

              <button
                onClick={nextImage}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSchema;
