import React, { useEffect, useRef, useState } from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { BiCommentAdd } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { GrRedo, GrUndo } from "react-icons/gr";

const IconsData = [
  { imgUrl: "/blank.jpg" },
  { imgUrl: "/close.png" },
  { imgUrl: "/check.png" },
];

const ImageContainer = () => {
  const [scale, setScale] = useState(1); // Initial zoom level
  const [icons, setIcons] = useState([]); // State for placed icons
  const [isDraggingIcon, setIsDraggingIcon] = useState(false); // Track if an icon is being dragged
  const [currentIcon, setCurrentIcon] = useState(null); // Store the currently selected icon
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Track mouse position for preview
  const [iconModal, setIconModal] = useState(false);
  const [draggedIconIndex, setDraggedIconIndex] = useState(null);
  const containerRef = useRef(null);

  // Zoom in and out
  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 1));

  // Track mouse movement for dragging icons
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollOffsetX = containerRef.current.scrollLeft;
      const scrollOffsetY = containerRef.current.scrollTop;

      if (isDraggingIcon && draggedIconIndex !== null) {
        const updatedIcons = [...icons];
        updatedIcons[draggedIconIndex] = {
          ...updatedIcons[draggedIconIndex],
          x: e.clientX - containerRect.left + scrollOffsetX,
          y: e.clientY - containerRect.top + scrollOffsetY,
        };
        setIcons(updatedIcons);
      } else if (isDraggingIcon) {
        setMousePos({
          x: e.clientX - containerRect.left + scrollOffsetX,
          y: e.clientY - containerRect.top + scrollOffsetY,
        });
      }
    }
  };

  // Handle icon selection
  const handleIconClick = (iconUrl) => {
    setIsDraggingIcon(true); // Enable dragging mode
    setCurrentIcon(iconUrl); // Set the selected icon
    setIconModal(false); // Close the icon modal
  };

  // Handle dropping the icon on the image
  const handleImageClick = (e) => {
    if (containerRef.current && currentIcon) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollOffsetX = containerRef.current.scrollLeft;
      const scrollOffsetY = containerRef.current.scrollTop;

      setIcons([
        ...icons,
        {
          iconUrl: currentIcon,
          x: e.clientX - containerRect.left + scrollOffsetX,
          y: e.clientY - containerRect.top + scrollOffsetY,
        },
      ]);
      setCurrentIcon(null);
      setIsDraggingIcon(false);
    }
  };

  // Start dragging an existing icon
  const handleIconDragStart = (index, e) => {
    setDraggedIconIndex(index);
    setIsDraggingIcon(true);
    e.preventDefault(); // Prevent default to avoid text selection
  };

  // Stop dragging an icon
  const handleMouseUp = () => {
    setIsDraggingIcon(false);
    setDraggedIconIndex(null);
  };

  // Handle right-click to stop dragging and hide icon
  const handleRightClick = (e) => {
    e.preventDefault(); // Prevent default context menu
    setIsDraggingIcon(false);
    setDraggedIconIndex(null);
  };

  // Close the dragging icon when right-clicked
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("contextmenu", handleRightClick); // Right-click handler
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);

  const IconModal = IconsData.map((item) => (
    <img
      onClick={() => handleIconClick(item.imgUrl)}
      src={item.imgUrl}
      width={100}
      height={100}
      className="md h-[60px] w-full cursor-pointer rounded p-2 shadow hover:bg-white"
      alt="icon"
    />
  ));

  return (
    <>
      <div className="flex justify-center border bg-[#e0e2e6] p-2">
        <div className="me-2 flex justify-center">
          <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
            <span className="flex items-center justify-center">
              <span className="mr-1">75%</span>
              <IoIosArrowDown />
            </span>
          </button>

          <div>
            <button
              className="mb-2 me-1 rounded-md px-2.5 py-2.5 text-sm font-medium text-gray-900 opacity-70 hover:bg-gray-100 focus:outline-none"
              onClick={zoomIn}
            >
              <FiZoomIn />
            </button>

            <button
              className="mb-2 rounded-md px-2.5 py-2.5 text-sm font-medium text-gray-900 opacity-70 hover:bg-gray-100 focus:outline-none"
              onClick={zoomOut}
            >
              <FiZoomOut />
            </button>
          </div>
        </div>

        <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <LuPencilLine />
        </button>

        <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <BiCommentAdd />
        </button>

        {/* Icon Modal Button and Modal */}
        <div className="relative flex">
          <div className="mb-2 me-2 flex w-[200px] justify-center bg-white">
            {!currentIcon && <span>No Icon Selected</span>}
            {currentIcon && (
              <img
                src={currentIcon}
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
          {iconModal && (
            <div className="absolute z-10 mt-11 grid h-[300px] w-[240px] border-spacing-1 grid-cols-1 gap-2 border bg-gray-50 p-2 shadow-md sm:grid-cols-2 md:grid-cols-3">
              {IconModal}
            </div>
          )}
        </div>

        {/* Undo and Redo Buttons */}
        <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <GrUndo />
        </button>
        <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
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
        onClick={handleImageClick} // Handle image click for dropping the icon
        onMouseMove={handleMouseMove} // Track mouse move for icon dragging preview
      >
        <img
          src={`/sampleimg/CS603_1119_page-1.jpg`}
          alt="Viewer"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease-in-out",
            maxWidth: "none",
          }}
        />

        {/* Render all placed icons */}
        {icons.map((icon, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${icon.y}px`,
              left: `${icon.x}px`,
              zIndex: 10,
              border: "2px dashed black", // Boundary for draggable icons
              padding: "5px",
            }}
            onMouseDown={(e) => handleIconDragStart(index, e)} // Allow dragging
          >
            <img src={icon.iconUrl} alt="icon" width={40} height={40} />
          </div>
        ))}

        {/* Icon following the mouse while dragging */}
        {isDraggingIcon && currentIcon && (
          <div
            style={{
              position: "absolute",
              top: `${mousePos.y}px`,
              left: `${mousePos.x}px`,
              zIndex: 1000,
              pointerEvents: "none",
            }}
          >
            <img src={currentIcon} alt="dragging-icon" width={40} height={40} />
          </div>
        )}
      </div>
    </>
  );
};

export default ImageContainer;
