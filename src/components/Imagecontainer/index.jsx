// src/ImageViewer.js
import React, { useState } from "react";
import { FiZoomIn } from "react-icons/fi";
import { FiZoomOut } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { BiCommentAdd } from "react-icons/bi";
import { FcCheckmark } from "react-icons/fc";
const ImageContainer = ({ imageUrl }) => {
  const [scale, setScale] = useState(1); // Initial zoom level
  const [isDragging, setIsDragging] = useState(false); // For drag functionality
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Start position for dragging
  const [translate, setTranslate] = useState({ x: 0, y: 0 }); // For moving the image

  // Zoom in and out
  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Limit max scale to 3
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 1)); // Limit min scale to 1
  };

  // Start dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
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

  return (
    <>
      <button
        className="mb-2 me-2 rounded-full  bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        onClick={zoomIn}
        style={{ marginRight: "5px" }}
      >
        <FiZoomIn />
      </button>
      <button
        className="mb-2 me-2 rounded-full  bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        onClick={zoomOut}
      >
        <FiZoomOut />
      </button>
      <button
        className="mb-2 me-2 rounded-full  bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        onClick={zoomOut}
      >
        <LuPencilLine />
      </button>
      <button
        className="mb-2 me-2 rounded-full  bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        onClick={zoomOut}
      >
        <BiCommentAdd />
      </button>
      <button
        className="mb-2 me-2 rounded-full  bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        onClick={zoomOut}
      >
        <FcCheckmark />
      </button>

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
          src={imageUrl}
          alt="Viewer"
          style={{
            transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
            transformOrigin: "top left", // Ensure scaling works from top left corner
            transition: "transform 0.2s ease-in-out", // Smooth transition on zoom
            maxWidth: "none", // Prevents image from being resized to fit the container
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 10,
          }}
        ></div>
      </div>
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          {Array.from({ length: 10 }, (_, index) => (
            <button
              key={index + 1}
              // onClick={() => handlePageClick(index + 1)}
              style={{
                margin: "5px",
                // backgroundColor: pageNumber === index + 1 ? "#007bff" : "#fff",
                // color: pageNumber === index + 1 ? "#fff" : "#000",
                border: "1px solid #007bff",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "10px" }}>
          <span>Page {1} of {30}</span>
        </div>
      </div>
      <button
        type="button"
        class="mb-2 me-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-red-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-red-300 dark:shadow-lg dark:shadow-red-800/80 dark:focus:ring-red-800"
      >
        Reject booklet
      </button>
    </>
  );
};

export default ImageContainer;
