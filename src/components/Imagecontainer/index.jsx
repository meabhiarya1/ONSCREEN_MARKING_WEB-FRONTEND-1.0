import React, { useRef, useState } from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { BiCommentAdd } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { AnswerData } from "data/answer";
import AnswerModal from "components/AnswerModal";
import { FaUndoAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GrRedo } from "react-icons/gr";
import { GrUndo } from "react-icons/gr";
const IconsData = [
  { imgUrl: "/blank.jpg" },
  { imgUrl: "/close.png" },
  { imgUrl: "/check.png" },
];
const ImageContainer = () => {
  const [scale, setScale] = useState(1); // Initial zoom level
  const [ticks, setTicks] = useState([]); // State for tick positions
  const [isTickDragging, setIsTickDragging] = useState(false); // To handle tick dragging
  const [currentTickIndex, setCurrentTickIndex] = useState(null); // Index of the currently dragged tick
  const [showModal, setShowModal] = useState(false); // Toggle the modal visibility
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 }); // Position for modal
  const [currentPage, setCurrentPage] = useState(1);
  const [iconModal, setIconModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const containerRef = useRef(null);
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
      const containerRect = containerRef.current.getBoundingClientRect();
      const updatedTicks = [...ticks];
      updatedTicks[currentTickIndex] = {
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top,
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


  const handleImgClick = (event) => {
    setSelectedIcon(event.target.src);
    setIconModal(false);
  };
  const IconModal = IconsData.map((item) => {
    return (
      <img
        onClick={handleImgClick}
        src={item.imgUrl}
        width={100}
        height={100}
        className="md h-[60px] w-full cursor-pointer rounded p-2 shadow hover:bg-white"
        alt="close"
      />
    );
  });
  return (
    <>
      <div className="flex justify-center border bg-[#e0e2e6] p-2">
        {/* Left Group of Buttons */}
        <div className="me-2 flex justify-center">
          <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
            <span className="flex items-center justify-center">
              <span className="mr-1">75%</span>
              <IoIosArrowDown />
            </span>
          </button>

          <div>
            <button
              className="mb-2 me-1 rounded-md  px-2.5 py-2.5 text-sm font-medium text-gray-900 opacity-70 hover:bg-gray-100 focus:outline-none"
              onClick={zoomIn}
            >
              <FiZoomIn />
            </button>

            <button
              className="mb-2 rounded-md  px-2.5 py-2.5 text-sm font-medium text-gray-900 opacity-70 hover:bg-gray-100 focus:outline-none"
              onClick={zoomOut}
            >
              <FiZoomOut />
            </button>
          </div>
        </div>

        {/* Other Buttons */}
        <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <LuPencilLine />
        </button>

        <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <BiCommentAdd />
        </button>

        {/* Icon Modal Button and Modal */}
        <div className="relative flex">
          {" "}
          {/* Make this relative to control the modal */}
          <div className="mb-2 me-2 flex w-[200px] justify-center bg-white">
            {!selectedIcon && <span>No Icon Selected</span>}
            {selectedIcon && (
              <img
                src={`${selectedIcon}`}
                width={40}
                height={10}
                className="md rounded p-1 shadow"
                alt="icon"
              />
            )}
          </div>
          <button
            onClick={() => setIconModal(!iconModal)}
            className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            <span
              className={`inline-block transition-transform duration-300 ${
                iconModal ? "rotate-180" : ""
              }`}
            >
              <IoIosArrowDown />
            </span>
          </button>
          {/* Icon Modal */}
          {iconModal && (
            <div className="absolute z-10 mt-11 grid h-[300px] w-[240px] border-spacing-1 grid-cols-1 gap-2 border bg-gray-50 p-2 shadow-md sm:grid-cols-2 md:grid-cols-3">
              {IconModal}
            </div>
          )}
        </div>

        {/* Undo and Redo Buttons */}
        <button
          className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
          // onClick={zoomIn}
        >
          <GrUndo />
        </button>
        <button
          className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
          // onClick={zoomIn}
        >
          <GrRedo />
        </button>
      </div>

      {/* Image Viewer Section */}
      <div
        ref={containerRef}
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
          src={`/sampleimg/CS603_1119_page-${currentPage}.jpg`}
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
