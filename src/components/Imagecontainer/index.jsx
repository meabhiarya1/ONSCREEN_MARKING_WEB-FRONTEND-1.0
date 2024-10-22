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
const ImageContainer = () => {
  const [scale, setScale] = useState(1); // Initial zoom level
  const [ticks, setTicks] = useState([]); // State for tick positions
  const [isTickDragging, setIsTickDragging] = useState(false); // To handle tick dragging
  const [currentTickIndex, setCurrentTickIndex] = useState(null); // Index of the currently dragged tick
  const [showModal, setShowModal] = useState(false); // Toggle the modal visibility
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 }); // Position for modal
  const [currentPage, setCurrentPage] = useState(1);
  const [iconModal, setIconModal] = useState(false);
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
  const paginationHandler = (index) => setCurrentPage(index);
  const pageList = Array.from({ length: 25 }, (_, index) => {
    const activeClass =
      currentPage === index + 1
        ? "flex h-8 items-center justify-center border border-gray-300 bg-blue-50 px-3 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
        : "flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

    return (
      <li key={index + 1}>
        <button
          href="#"
          onClick={() => {
            console.log(index);
            paginationHandler(index + 1);
          }}
          aria-current={currentPage === index + 1 ? "page" : ""}
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
    if (currentPage < 25 - 1) {
      setCurrentPage((item) => item + 1);
    }
  };
  // Helper function to generate page list with ellipsis
  const generatePageList = (totalPages, currentPage) => {
    const pageList = [];
    const maxPagesToShow = 7;
    const pagesAroundCurrent = 2; // Show 2 pages before and after current

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to 7, show all pages
      for (let i = 0; i < totalPages; i++) {
        pageList.push(renderPageButton(i, currentPage));
      }
    } else {
      // Always show the first page
      pageList.push(renderPageButton(0, currentPage));

      // Show ellipsis if needed before current page range
      if (currentPage > pagesAroundCurrent + 1) {
        pageList.push(<li key="start-ellipsis">...</li>);
      }

      // Show pages around the current page
      const startPage = Math.max(1, currentPage - pagesAroundCurrent);
      const endPage = Math.min(
        totalPages - 2,
        currentPage + pagesAroundCurrent
      );

      for (let i = startPage; i <= endPage; i++) {
        pageList.push(renderPageButton(i, currentPage));
      }

      // Show ellipsis if needed after current page range
      if (currentPage < totalPages - pagesAroundCurrent - 2) {
        pageList.push(<li key="end-ellipsis">...</li>);
      }

      // Always show the last page
      pageList.push(renderPageButton(totalPages - 1, currentPage));
    }

    return pageList;
  };

  // Function to render individual page button
  const renderPageButton = (pageNumber, currentPage) => (
    <li key={pageNumber}>
      <button
        onClick={() => () => paginationHandler(pageNumber)}
        className={
          pageNumber === currentPage
            ? "flex h-8 items-center justify-center border border-gray-300 bg-blue-50 px-3 leading-tight text-blue-600 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            : "flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        }
      >
        {pageNumber + 1}
      </button>
    </li>
  );

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
              className="mb-2 me-1 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={zoomIn}
            >
              <FiZoomIn />
            </button>

            <button
              className="mb-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
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
            <img
              src="/blank.jpg"
              width={50}
              height={10}
              className="md rounded p-1 shadow"
            />
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
            <div className="absolute z-10 mt-11 grid h-[400px] w-[240px] border-spacing-1 grid-cols-1 gap-2 border bg-lightPrimary p-2 sm:grid-cols-2 md:grid-cols-3">
              <img
                src="/blank.jpg"
                width={100}
                height={120}
                className="md  h-[60px] w-full cursor-pointer rounded p-1 shadow hover:bg-white"
                alt="blank"
              />

              <img
                src="/close.png"
                width={100}
                height={100}
                className="md h-[60px] w-full cursor-pointer rounded p-2 shadow hover:bg-white"
                alt="close"
              />
              <img
                src="/check.png"
                width={100}
                height={100}
                className="md h-[60px] w-full cursor-pointer rounded p-2 shadow hover:bg-white"
                alt="check"
              />
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

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <nav aria-label="Page navigation example">
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
                  currentPage < 25 && currentPage !== 25 - 1
                    ? "flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    : "flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav> */}
      </div>
      {/* Icon modal */}

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
