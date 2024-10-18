import React, { useState } from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { BiCommentAdd } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { AnswerData } from "data/answer";
import AnswerModal from "components/AnswerModal";

const ImageContainer = ({ imageUrl }) => {
  const [scale, setScale] = useState(1); // Initial zoom level
  const [ticks, setTicks] = useState([]); // State for tick positions
  const [isTickDragging, setIsTickDragging] = useState(false); // To handle tick dragging
  const [currentTickIndex, setCurrentTickIndex] = useState(null); // Index of the currently dragged tick
  const [showModal, setShowModal] = useState(false); // Toggle the modal visibility
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 }); // Position for modal
  const [currentPage, setCurrentPage] = useState(0);

  // Zoom in and out
  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 1));

  // Add a new tick at the current mouse position
  const handleTickClick = (e) => {
    const newTick = {
      x: e.clientX,
      y: e.clientY,
    };
    setTicks((prevTicks) => [...prevTicks, newTick]);
  };

  // Start dragging the tick
  const handleTickMouseDown = (index, e) => {
    setIsTickDragging(true);
    setCurrentTickIndex(index);
  };

  // Handle tick dragging
  const handleTickMouseMove = (e) => {
    if (isTickDragging && currentTickIndex !== null) {
      const updatedTicks = [...ticks];
      updatedTicks[currentTickIndex] = {
        x: e.clientX,
        y: e.clientY,
      };
      setTicks(updatedTicks);
    }
  };

  // Stop dragging the tick
  const handleTickMouseUp = () => {
    setIsTickDragging(false);
    setCurrentTickIndex(null);
  };

  const handleTickMouseLeave = () => {
    setIsTickDragging(false);
    setCurrentTickIndex(null);
  };

  // Handle right-click and show the modal
  const handleRightClick = (e) => {
    e.preventDefault(); // Prevent the default context menu
    setModalPos({ x: e.clientX, y: e.clientY }); // Capture the right-click position
    setShowModal(true); // Show the modal
  };
  const handleLeftClick = () => {
    setShowModal(false);
  };
  const paginationHandler = (index) => setCurrentPage(index);
  const pageList = Array.from({ length: AnswerData.length }, (_, index) => {
    const activeClass =
      currentPage === index
        ? "flex h-8 items-center justify-center border border-gray-300 bg-blue-50 px-3 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
        : "flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

    return (
      <li key={index + 1}>
        <button
          href="#"
          onClick={() => paginationHandler(index)}
          aria-current={currentPage === index ? "page" : ""}
          class={activeClass}
        >
          {index + 1}
        </button>
      </li>
    );
  });

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((item) => item - 1);
    }
  };
  const handleNext = () => {
    console.log(currentPage);
    if (currentPage < AnswerData.length - 1) {
      setCurrentPage((item) => item + 1);
    }
  };
  return (
    <>
      <div className="justify-center border bg-gray-300">
        <button
          className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
          onClick={zoomIn}
        >
          <FiZoomIn />
        </button>

        <button
          className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
          onClick={zoomOut}
        >
          <FiZoomOut />
        </button>

        <button className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <LuPencilLine />
        </button>

        <button className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <BiCommentAdd />
        </button>

        <button
          className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
          onClick={handleTickClick} // Add a tick on click
        >
          <TiTick />
        </button>

        <button className="mb-2 me-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <ImCross color="red" />
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          overflow: "auto",
          position: "relative",
          width: "100%",
          height: "75vh",
        }}
        onContextMenu={handleRightClick} // Capture right-click event
        onClick={handleLeftClick}
      >
        <img
          src={AnswerData[currentPage].imgUrl}
          alt="Viewer"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease-in-out",
            maxWidth: "none",
          }}
        />

        {/* Render all ticks */}
        {ticks.map((tick, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${tick.y}px`,
              left: `${tick.x}px`,
              zIndex: 10,
              fontSize: "50px", // Adjust size of the tick
              cursor:
                isTickDragging && currentTickIndex === index
                  ? "grabbing"
                  : "grab",
            }}
            onMouseDown={(e) => handleTickMouseDown(index, e)}
            onMouseMove={handleTickMouseMove}
            onMouseUp={handleTickMouseUp}
            onMouseLeave={handleTickMouseLeave}
          >
            <TiTick color="green" />
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <nav aria-label="Page navigation example">
          <ul class="inline-flex -space-x-px text-sm">
            <li>
              <button
                onClick={handlePrev}
                class={
                  currentPage > 0
                    ? "ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-blue-50  px-3 leading-tight text-blue-600  hover:bg-blue-100  hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    : "ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }
              >
                Previous
              </button>
            </li>
            {pageList}
            <li>
              <button
                onClick={handleNext}
                class={
                  currentPage < AnswerData.length &&
                  currentPage !== AnswerData.length - 1
                    ? "flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    : "flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Render the modal at the right-click position */}
      {showModal && (
        <div
          style={{
            position: "absolute",
            top: `${modalPos.y}px`,
            left: `${modalPos.x}px`,
            zIndex: 999,
          }}
        >
          <AnswerModal />
        </div>
      )}
    </>
  );
};

export default ImageContainer;
