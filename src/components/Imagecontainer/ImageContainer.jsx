import React, { useEffect, useRef, useState } from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { BiCommentAdd } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { GrRedo, GrUndo } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import Tools from "./Tools";
import throttle from "lodash.throttle";
import { jwtDecode } from "jwt-decode";
import { getAllEvaluatorTasks } from "components/Helper/Evaluator/EvalRoute";

import { setCurrentIcon, setIsDraggingIcon } from "store/evaluatorSlice";
const IconsData = [
  { imgUrl: "/blank.jpg" },
  { imgUrl: "/close.png" },
  { imgUrl: "/check.png" },
];

const ImageContainer = (props) => {
  const [scale, setScale] = useState(1); // Initial zoom level
  const [icons, setIcons] = useState([]); // State for placed icons
  // const [isDraggingIcon, setIsDraggingIcon] = useState(false); // Track if an icon is being dragged
  // const [currentIcon, setCurrentIcon] = useState(null); // Store the currently selected icon
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
  const [mouseBasePos, setMouseBasePos] = useState({ x: 0, y: 0 });
  const [mouseUp, setMouseUp] = useState(false);
  const [selectedColor, setSelectedColor] = useState("red");
  const [isCursorInside, setIsCursorInside] = useState(false);
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(10);
  const containerRef = useRef(null);
  const currentIndex = evaluatorState.currentIndex;
  const currentQuestionNo = evaluatorState.currentQuestion;
  const baseImageUrl = evaluatorState.baseImageUrl;
  const currentIcon = evaluatorState.currentIcon;
  const isDraggingIcon = evaluatorState.isDraggingIcon;
  const currentMarkDetails = evaluatorState.currentMarkDetails;
  const canvasRef = useRef(null);
  const iconRefs = useRef([]);
  const dispatch = useDispatch();
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

      // Clear the canvas for redraw
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.lineJoin = "round"; // Smooth line joins

      let prevX = null;
      let prevY = null;

      // Iterate through the drawing array
      drawing.forEach(({ x, y, mode, strokeWidth, color }) => {
        if (mode === "start") {
          // Update previous coordinates for the start of a new stroke
          prevX = x;
          prevY = y;
        }
        if (mode === "draw") {
          context.beginPath();
          context.lineWidth = strokeWidth || currentStrokeWidth; // Use strokeWidth or default to currentStrokeWidth
          context.strokeStyle = color || selectedColor; // Use color or default to selectedColor

          context.moveTo(prevX, prevY); // Start from the previous point
          context.lineTo(x, y); // Draw to the current point
          context.stroke(); // Render the line
          context.closePath();

          // Update previous coordinates
          prevX = x;
          prevY = y;
        }
      });
    }
  }, [drawing, scale, startDrawing, currentStrokeWidth, selectedColor]);

  const handleIconDoubleClick = (index) => {
    setSelectedIcon(index); // Mark the icon as selected
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

  // Update cursor position
  const handleBaseMouseMove = throttle((event) => {
    setMouseBasePos({ x: event.clientX, y: event.clientY });
  }, 4); // Update every ~16ms (60FPS)

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("mousemove", handleBaseMouseMove);
      return () =>
        container.removeEventListener("mousemove", handleBaseMouseMove); // Cleanup
    }
  }, []);
  // Save the canvas state as a base64 string
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setCanvasStates((prevStates) => ({
      ...prevStates,
      [currentImage]: dataURL, // Save the canvas state for the current image
    }));
  };
  // console.log(canvasStates);
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
      {
        x,
        y,
        mode: "start",
        strokeWidth: currentStrokeWidth, // Include current stroke width
        color: selectedColor,
      },
      // Add starting point to differentiate new drawing
    ]);
  };

  // Stop drawing when the mouse is released
  const handleCanvasMouseUp = () => {
    setStartDrawing(false);
    setMouseUp(true);
    // setIsDrawing(false);
  };

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
        setDrawing((prev) => [
          ...prev,
          {
            x,
            y,
            mode: "draw",
            color: selectedColor, // Store the current color
            strokeWidth: currentStrokeWidth,
          },
        ]);
      }
    }
  };

  // Handle icon selection
  const handleIconClick = (iconUrl) => {
    setIsDraggingIcon(true); // Enable dragging mode
    dispatch(setCurrentIcon(iconUrl));
    // setCurrentIcon(iconUrl); // Set the selected icon
    setIconModal(false); // Close the icon modal
  };

  // Handle dropping the icon on the image
  const handleImageClick = (e) => {
    if (containerRef.current && currentIcon) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollOffsetX = containerRef.current.scrollLeft;
      const scrollOffsetY = containerRef.current.scrollTop;
      // const updatedIcons = [...icons];
      // updatedIcons[index].timestamp = new Date().toLocaleString();
      setIcons([
        ...icons,
        {
          question: currentQuestionNo,
          currentMarkDetails: currentMarkDetails,
          timestamp: new Date().toLocaleString(),
          iconUrl: currentIcon,
          x: (e.clientX - containerRect.left + scrollOffsetX) / scale, // Adjust for scaling
          y: (e.clientY - containerRect.top + scrollOffsetY) / scale, // Adjust for scaling
        },
      ]);
      // setCurrentIcon(null);
      dispatch(setCurrentIcon(null));

      setIsDraggingIcon(false);
    }
  };
  console.log(currentMarkDetails);
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
  console.log(
    `${process.env.REACT_APP_API_URL}\\${baseImageUrl}image_${currentIndex}.png`
  );
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
  console.log(icons);
  return (
    <>
      <Tools
        scalePercent={scalePercent}
        handleZoomMenu={handleZoomMenu}
        isZoomMenuOpen={isZoomMenuOpen}
        ZoomModal={ZoomModal}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        iconModal={iconModal}
        setIconModal={setIconModal}
        currentIcon={currentIcon}
        IconModal={IconModal}
        setSelectedColor={setSelectedColor}
        setCurrentStrokeWidth={setCurrentStrokeWidth}
      />

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
        onMouseDown={handleCanvasMouseDown} // Only draw when in drawing mode
        onMouseUp={handleCanvasMouseUp}
        onMouseEnter={() => {
          setIsCursorInside(true);
        }}
        onMouseLeave={() => {
          setIsCursorInside(false);
        }}
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
            src={`${process.env.REACT_APP_API_URL}\\${baseImageUrl}\\image_${currentIndex}.png`}
            alt="Viewer"
          />
          {/* Render all placed icons */}
          {icons.map((icon, index) => (
            <div
              key={index}
              ref={(el) => (iconRefs.current[index] = el)}
              className={`absolute z-10 rounded-lg  p-2 transition-transform duration-200 
      ${selectedIcon === index ? "border-2 border-blue-500" : ""}
    `}
              style={{
                top: `${icon.y}px`,
                left: `${icon.x}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              onMouseDown={(e) => {
                handleIconDragStart(index, e);
              }}
              onDoubleClick={() => handleIconDoubleClick(index)}
            >
              {/* Icon Image */}
              <img
                src={icon.iconUrl}
                alt="icon"
                className="mx-auto h-10 w-10"
              />

              {/* Allotted Marks and Question */}
              <div className="mt-2 text-center text-sm font-semibold text-gray-700">
                {`Q${icon.question} → ${icon?.currentMarkDetails?.allottedMarks}`}
              </div>

              {/* Timestamp */}
              <div className="mt-1 text-center text-xs italic text-gray-500">
                {icon.timestamp || "No Timestamp"}
              </div>

              {/* Cross Button for Deletion */}
              {selectedIcon === index && (
                <button
                  className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
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

        {/* Display current question number at cursor */}
        {isCursorInside && (
          <div
            className={`z-1000 pointer-events-none fixed rounded bg-gray-100 p-2.5 text-sm shadow-md`}
            style={{
              left: `${mouseBasePos.x}px`,
              top: `${mouseBasePos.y + 5}px`, // Dynamic positioning
            }}
          >
            {`Q(${currentQuestionNo})`}
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(ImageContainer);
