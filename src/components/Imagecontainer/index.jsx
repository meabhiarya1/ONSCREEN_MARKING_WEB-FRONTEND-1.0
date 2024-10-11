import React, { useState } from "react";
import { FiZoomIn } from "react-icons/fi";
import { FiZoomOut } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { BiCommentAdd } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { AnswerData } from "data/answer";
const ImageContainer = ({ imageUrl }) => {
  const [scale, setScale] = useState(1); // Initial zoom level
  const [isDragging, setIsDragging] = useState(false); // For drag functionality
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Start position for dragging
  const [translate, setTranslate] = useState({ x: 0, y: 0 }); // For moving the image
  const [showTick, setShowTick] = useState(false); // State to toggle tick icon
  const [currentPage, setCurrentPage] = useState(0);
  // Zoom in and out
  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Limit max scale to 3
  };

  const zoomOut = () => {
    setScale((prevScale) =>prevScale - 0.1); // Limit min scale to 1
  };

  // Start dragging
  const handleMouseDown = (e) => {
    setIsDragging(false);
    setStartPos({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  // Handle dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      setTranslate({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Prevent dragging when mouse leaves the image
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Toggle the tick icon visibility
  const handleTickClick = () => {
    setShowTick((prev) => !prev);
  };
  const paginationHandler = (index) => {
    console.log(index);
    setCurrentPage(index);
  };
  console.log(AnswerData[currentPage].imgUrl);
  return (
    <>
      <div className="justify-center border bg-gray-300">
        <button
          className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          onClick={zoomIn}
          style={{ marginRight: "5px" }}
        >
          <FiZoomIn />
        </button>

        <button
          className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          onClick={zoomOut}
        >
          <FiZoomOut />
        </button>

        <button className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          <LuPencilLine />
        </button>

        <button className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          <BiCommentAdd />
        </button>

        <button
          className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          onClick={handleTickClick} // Toggle tick on click
        >
          <TiTick color="green" width={"400px"} />
        </button>

        <button className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          <ImCross color="red" />
        </button>

        <button className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          <img src="/blank.jpg" width={50} height={50} alt="placeholder" />
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          overflow: "auto",
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
          width: "100%",
          height: "500px", // You can set any height
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <img
          xcg
          src={AnswerData[currentPage].imgUrl}
          alt="Viewer"
          style={{
            transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
            transformOrigin: "top left", // Ensure scaling works from top left corner
            transition: "transform 0.2s ease-in-out", // Smooth transition on zoom
            maxWidth: "none", // Prevents image from being resized to fit the container
          }}
        />

        {/* Conditionally render the tick icon on top of the image */}
        {showTick && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 10,
              fontSize: "50px", // Adjust size of the tick
            }}
          >
            <TiTick color="green" />
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          {Array.from({ length: AnswerData.length }, (_, index) => (
            <button
              key={index + 1}
              style={{
                margin: "5px",
                backgroundColor: currentPage === index  ? "#007bff" : "#fff",
                color: currentPage === index  ? "#fff" : "#000",
                border: "1px solid #007bff",
                padding: "5px 10px",
                cursor: "pointer",
              }}
              onClick={() => paginationHandler(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "10px" }}>
          <span>
            Page {1} of {30}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mb-2 me-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-red-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-red-300 dark:shadow-lg dark:shadow-red-800/80 dark:focus:ring-red-800"
      >
        Reject booklet
      </button>
    </>
  );
};

export default ImageContainer;
