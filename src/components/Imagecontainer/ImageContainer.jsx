import React, { useEffect, useRef, useState } from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { BiCommentAdd } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { GrRedo, GrUndo } from "react-icons/gr";
import { useSelector } from "react-redux";

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
  const [isDrawing, setIsDrawing] = useState(false); // Drawing mode toggle
  const [drawing, setDrawing] = useState([]); // Store strokes
  const evaluatorState = useSelector((state) => state.evaluator);
  const [activeDrawing, setActiveDrawing] = useState(false);
  const [scalePercent, setScalePercent] = useState(100);
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [canvasStates, setCanvasStates] = useState({});
  const [currentImage, setCurrentImage] = useState(null);
  const [startDrawing, setStartDrawing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [mouseUp, setMouseUp] = useState(false);
  const containerRef = useRef(null);
  const currentIndex = evaluatorState.currentIndex;
  const canvasRef = useRef(null);
  const iconRefs = useRef([]);
  // Handle clicks outside of selected icon
  // Handle double-click outside of the specific image container
  useEffect(() => {
    const handleOutsideDoubleClick = (event) => {
      if (selectedIcon !== null) {
        const selectedIconRef = iconRefs.current[selectedIcon];
        if (selectedIconRef && !selectedIconRef.contains(event.target)) {
          setSelectedIcon(null); // Deselect icon if clicked outside
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideDoubleClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideDoubleClick); // Cleanup on unmount
    };
  }, [selectedIcon]);

  const handleIconDoubleClick = (index) => {
    setSelectedIcon(index); // Mark the icon as selected
  };

  const handleDeleteIcon = (index) => {
    setIcons((prevIcons) => prevIcons.filter((_, i) => i !== index)); // Remove the icon
    setSelectedIcon(null); // Reset selected icon
  };
  // Zoom in and out with smooth transition
  const zoomIn = () => setScale((prevScale) => prevScale + 0.1);
  const zoomOut = () => setScale((prevScale) => prevScale - 0.1);
  // Start drawing when the mouse is pressed down

  const handleCanvasMouseDown = (e) => {
    setStartDrawing(true); // Set flag for drawing
    setMouseUp(false); // Reset mouse up state

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setDrawing((prev) => [
      ...prev,
      { x, y, mode: "start" }, // Add starting point to differentiate new drawing
    ]);
  };

  // Continue drawing when the mouse is moved
  const handleCanvasMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    setDrawing((prev) => [...prev, { x, y, mode: "draw" }]);
  };

  // Stop drawing when the mouse is released
  const handleCanvasMouseUp = () => {
    setStartDrawing(false);
    setMouseUp(true);
    // setIsDrawing(false);
  };

  // Load the canvas state when the image changes
  useEffect(() => {
    const loadCanvasState = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Load the saved state for the current index
      if (canvasStates[currentIndex]) {
        const img = new Image();
        img.src = canvasStates[currentIndex];
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    };

    // Save the current canvas state before changing the index
    if (currentImage !== null) {
      saveCanvasState();
    }

    setCurrentImage(currentIndex); // Track the currently displayed image
    loadCanvasState();
  }, [currentIndex]);

  // Save the canvas state as a base64 string
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();

    setCanvasStates((prevStates) => ({
      ...prevStates,
      [currentImage]: dataURL, // Save the canvas state for the current image
    }));
  };

  // Function to update canvas size when image is scaled
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const imageElement = document.querySelector('img[alt="Viewer"]');
      const imageWidth = imageElement ? imageElement.width : 0;
      const imageHeight = imageElement ? imageElement.height : 0;

      // Scale the canvas size based on the scale factor
      const scaledWidth = imageWidth * scale;
      const scaledHeight = imageHeight * scale;

      setCanvasSize({ width: scaledWidth, height: scaledHeight });

      // Update canvas width and height
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
    }
  }, [scale]); // Run effect every time scale changes
  // Draw on the canvas
  useEffect(() => {
    if (startDrawing) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 2;
      context.strokeStyle = "red";
      context.lineJoin = "round";

      let prevX = null;
      let prevY = null;

      drawing.forEach(({ x, y, mode }) => {
        if (mode === "start") {
          prevX = x;
          prevY = y;
        }
        if (mode === "draw") {
          context.beginPath();
          context.moveTo(prevX, prevY);
          context.lineTo(x, y);
          context.closePath();
          context.stroke();
          prevX = x;
          prevY = y;
        }
      });
    }
  }, [drawing, scale]);

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
          x: (e.clientX - containerRect.left + scrollOffsetX) / scale, // Adjust for scaling
          y: (e.clientY - containerRect.top + scrollOffsetY) / scale, // Adjust for scaling
        };
        setIcons(updatedIcons);
      } else if (isDraggingIcon) {
        setMousePos({
          x: (e.clientX - containerRect.left + scrollOffsetX) / scale, // Adjust for scaling
          y: (e.clientY - containerRect.top + scrollOffsetY) / scale, // Adjust for scaling
        });
      } else if (isDrawing && startDrawing) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        setDrawing((prev) => [...prev, { x, y, mode: "draw" }]);
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
    // if (activeDrawing) {
    //   setIsDrawing(!isDrawing);
    // }
    if (containerRef.current && currentIcon) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollOffsetX = containerRef.current.scrollLeft;
      const scrollOffsetY = containerRef.current.scrollTop;

      setIcons([
        ...icons,
        {
          iconUrl: currentIcon,
          x: (e.clientX - containerRect.left + scrollOffsetX) / scale, // Adjust for scaling
          y: (e.clientY - containerRect.top + scrollOffsetY) / scale, // Adjust for scaling
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

  useEffect(() => {
    setScalePercent(Math.floor(scale * 100));
  }, [scale]);

  // Close the dragging icon when right-clicked
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("contextmenu", handleRightClick); // Right-click handler
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);

  const IconModal = IconsData.map((item, index) => (
    <img
      key={index}
      onClick={() => handleIconClick(item.imgUrl)}
      src={item.imgUrl}
      width={100}
      height={100}
      className="md h-[60px] w-full cursor-pointer rounded p-2 shadow hover:bg-white"
      alt="icon"
    />
  ));
  const handleZoomValueClick = () => {};
  const ZoomModal = Array.from({ length: 12 }, (_, index) => {
    const zoomValue = 40 + index * 10;
    return (
      <li
        key={index}
        onClick={() => handleZoomValueClick(zoomValue)}
        className="hover:bg-gray-300 "
      >
        {zoomValue}%
      </li>
    );
  });
  const handleZoomMenu = () => {
    setIsZoomMenuOpen(!isZoomMenuOpen);
  };

  return (
    <>
      <div className="flex justify-center border bg-[#e0e2e6] p-2">
        <aside className="me-2 flex justify-center">
          <div className="">
            <button
              className="mb-2 me-2 rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={handleZoomMenu}
            >
              <span className="flex items-center justify-center">
                <span className="mr-1">{scalePercent}%</span>
                <IoIosArrowDown />
              </span>
            </button>
            {isZoomMenuOpen && (
              <div className=" absolute z-10  h-[200px] w-[65px] border-spacing-1 cursor-pointer overflow-auto border bg-gray-50 p-2 shadow-md ">
                <ul>{ZoomModal}</ul>
              </div>
            )}
          </div>
          <div>
            <button
              className="mb-2 me-1 rounded-md px-2.5 py-2.5 text-sm font-medium text-gray-900 opacity-70 hover:bg-gray-100 focus:outline-none"
              onClick={zoomIn}
            >
              <FiZoomIn />
            </button>

            <button
              className="mb-2 rounded-md px-2.5 py-2.5 text-sm font-medium text-gray-900 opacity-70 focus:outline-none"
              onClick={zoomOut}
            >
              <FiZoomOut />
            </button>
          </div>
        </aside>

        <button
          className={`mb-2 me-2 rounded-md   px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none  ${
            isDrawing
              ? "bg-gray-300 hover:bg-gray-400 "
              : "bg-white hover:bg-gray-100 "
          }`}
          style={
            isDrawing
              ? { cursor: "url('/toolImg/Handwriting.cur'), auto" } // Pencil cursor when drawing
              : { cursor: "auto" } // Default cursor otherwise
          }
          onClick={() => setIsDrawing((prev) => !prev)}
        >
          <LuPencilLine />
        </button>

        <button className="mb-2 me-2 rounded-md bg-white px-2.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none">
          <BiCommentAdd />
        </button>

        {/* Icon Modal Button and Modal */}
        <div className="relative flex">
          <div className="mb-2 me-2 flex w-[200px] justify-center bg-white">
            {!currentIcon && (
              <span className="self-center">No Icon Selected</span>
            )}
            {currentIcon && (
              <img
                src={currentIcon}
                width={40}
                height={30}
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
              className={`block transition-transform duration-300 ${
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
          height: "80vh",
          cursor: isDrawing ? "url('/toolImg/Handwriting.cur'), auto" : "",
        }}
        onClick={handleImageClick} // Handle image click for dropping the icon
        onMouseMove={handleMouseMove} // Track mouse move for icon dragging preview
        // onMouseMove={handleCanvasMouseMove} // Track mouse move for drawing
        onMouseDown={handleCanvasMouseDown} // Only draw when in drawing mode
        onMouseUp={handleCanvasMouseUp}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease-in-out",
            maxWidth: "none",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <img
            src={`/sampleimg/CS603_1119_page-${currentIndex}.jpg`}
            alt="Viewer"
          />
          {/* Render all placed icons */}
          {icons.map((icon, index) => (
            <div
              key={index}
              ref={(el) => (iconRefs.current[index] = el)}
              style={{
                position: "absolute",
                top: `${icon.y}px`, // Scale the position
                left: `${icon.x}px`, // Scale the position
                zIndex: 10,
                border: selectedIcon === index ? "2px dashed black" : "none", // Show border if selected
                cursor: "pointer",
                padding: "5px",
                transform: `scale(${scale})`, // Scale the icon size
                transformOrigin: "top left", // Ensure proper scaling
                transition: "transform 0.2s ease-in-out", // Smooth transition
              }}
              onMouseDown={(e) => handleIconDragStart(index, e)} // Allow dragging
              onDoubleClick={() => handleIconDoubleClick(index)} // Show border and cross button
            >
              <img src={icon.iconUrl} alt="icon" width={40} height={40} />
              {/* Cross button for deletion */}
              {selectedIcon === index && (
                <button
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteIcon(index)}
                >
                  ✖
                </button>
              )}
            </div>
          ))}

          {/* Render the canvas for drawing */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: isDrawing ? "auto" : "none", // Only allow drawing in drawing mode
            }}
          />
        </div>
        {/* Icon following the mouse while dragging */}
        {isDraggingIcon && currentIcon && (
          <div
            style={{
              position: "absolute",
              top: `${mousePos.y * scale}px`, // Adjust for scaling
              left: `${mousePos.x * scale}px`, // Adjust for scaling
              zIndex: 1000,
              pointerEvents: "none",
              transform: `scale(${scale})`, // Scale the preview
              transition: "transform 0.2s ease-in-out", // Smooth transition
            }}
          >
            <img src={currentIcon} alt="dragging-icon" width={40} height={40} />
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(ImageContainer);
