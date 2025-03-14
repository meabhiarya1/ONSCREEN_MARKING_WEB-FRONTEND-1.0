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

import {
  setCurrentIcon,
  setIsDraggingIcon,
  setRerender,
  setIcons,
} from "store/evaluatorSlice";
import { postMarkById } from "components/Helper/Evaluator/EvalRoute";
import { createIcon } from "components/Helper/Evaluator/EvalRoute";
import { getIconsByImageId } from "components/Helper/Evaluator/EvalRoute";
import { deleteIconByImageId } from "components/Helper/Evaluator/EvalRoute";
import html2canvas from "html2canvas";
import { submitImageById } from "components/Helper/Evaluator/EvalRoute";
const IconsData = [{ imgUrl: "/blank.jpg" }];
const preprocessImage = (canvas) => {
  const context = canvas.getContext("2d");

  // Convert the image to grayscale (preprocessing step)
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
  }

  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
};
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
  const currentAnswerImageId = evaluatorState.currentAnswerPdfImageId;
  const currentQuestionDefinitionId =
    evaluatorState.currentQuestionDefinitionId;
  const currentAnswerPdfId = evaluatorState.currentAnswerPdfId;
  const canvasRef = useRef(null);
  const iconRefs = useRef([]);
  const dispatch = useDispatch();
  // const icons = evaluatorState.icons;

  // useEffect(()=>{
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");

  //   // Clear the canvas
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   // Load the saved state for the current index
  //   if (canvasStates[canvasStates.length-1]) {
  //     const img = new Image();
  //     img.src = canvasStates[currentIndex];
  //     img.onload = () => {
  //       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //     };
  //   }
  // },[isDrawing])
  // console.log(canvasStates)
  useEffect(() => {
    const fetchAllIcons = async () => {
      const icons = await getIconsByImageId(
        currentAnswerImageId,
        currentQuestionDefinitionId
      );

      if (Array.isArray(icons)) setIcons(icons);
    };
    if (currentQuestionDefinitionId && currentAnswerImageId) {
      fetchAllIcons();
    }
  }, [
    currentQuestionDefinitionId,
    currentAnswerImageId,
    evaluatorState.rerender,
  ]);
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
      const scaledWidth = imageWidth;
      const scaledHeight = imageHeight;

      setCanvasSize({ width: scaledWidth, height: scaledHeight });

      // Update canvas width and height
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
    }
  }, [isDrawing]); // Run effect every time scale changes
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

  const handleIconDoubleClick = (index) => {
    setSelectedIcon(index); // Mark the icon as selected
  };
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

    // Get the canvas image as PNG data URL
    const dataURL = canvas.toDataURL("image/png");

    // Optionally, store the canvas state
    setCanvasStates((prevStates) => ({
      ...prevStates,
      [currentImage]: dataURL, // Save the canvas state for the current image
    }));
  };

  const handleDeleteIcon = async (index, icon) => {
    if (icon?._id) {
      const res = await deleteIconByImageId(icon?._id, currentAnswerPdfId);

      setIcons((prevIcons) => prevIcons.filter((_, i) => i !== index)); // Remove the icon
      setSelectedIcon(null); // Reset selected icon
    } else {
      setIcons((prevIcons) => prevIcons.filter((_, i) => i !== index)); // Remove the icon
      setSelectedIcon(null);
    }

    dispatch(setRerender());
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
  const handleResizeStart = (index, e) => {
    e.preventDefault();
    e.stopPropagation();

    const initialX = e.clientX;
    const initialY = e.clientY;
    const initialWidth = +icons[index].width;
    const initialHeight = +icons[index].height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - initialX;
      const deltaY = moveEvent.clientY - initialY;

      setIcons((prevIcons) =>
        prevIcons.map((icon, i) =>
          i === index
            ? {
                ...icon,
                width: Math.max(20, initialWidth + deltaX), // Minimum size constraint
                height: Math.max(20, initialHeight + deltaY),
              }
            : icon
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
  const handleImageClick = async (e) => {
    if (containerRef.current && currentIcon) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollOffsetX = containerRef.current.scrollLeft;
      const scrollOffsetY = containerRef.current.scrollTop;
      const currentTimeStamp = new Date().toLocaleString();

      if (currentIcon !== "/blank.jpg") {
        const iconBody = {
          answerPdfImageId: currentAnswerImageId,
          questionDefinitionId: currentQuestionDefinitionId,
          iconUrl: currentIcon,
          question: currentQuestionNo,
          timeStamps: currentTimeStamp,

          x: (e.clientX - containerRect.left + scrollOffsetX) / scale,
          y: (e.clientY - containerRect.top + scrollOffsetY) / scale,
          width: 150,
          height: 80,
          mark: currentMarkDetails.allottedMarks,
        };
        const totalMarksBody = {
          ...currentMarkDetails,
          allottedMarks: currentMarkDetails.totalAllocatedMarks,
        };
        const response = await postMarkById(totalMarksBody);

        const res = await createIcon(iconBody);

        setIcons([
          ...icons,
          { ...res },
          // {
          //   _id: res._id,
          //   question: currentQuestionNo,
          //   mark: currentMarkDetails.allottedMarks,
          //   answerPdfImageId: currentMarkDetails.answerPdfId,
          //   questionDefinitionId: currentMarkDetails.questionDefinitionId,
          //   timeStamps: currentTimeStamp,
          //   iconUrl: currentIcon,
          //   x: (e.clientX - containerRect.left + scrollOffsetX) / scale, // Adjust for scaling
          //   y: (e.clientY - containerRect.top + scrollOffsetY) / scale, // Adjust for scaling
          //   width: 120, // Default width
          //   height: 50,
          // },
        ]);
      } else {
        const iconBody = {
          answerPdfImageId: currentAnswerImageId,
          questionDefinitionId: currentMarkDetails.questionDefinitionId,
          iconUrl: currentIcon,
          question: currentQuestionNo,
          timeStamps: currentTimeStamp,

          x: (e.clientX - containerRect.left + scrollOffsetX) / scale,
          y: (e.clientY - containerRect.top + scrollOffsetY) / scale,
          width: 150,
          height: 80,
        };

        const res = await createIcon(iconBody);

        setIcons([
          ...icons,
          { ...res },
          // {
          //   _id: res._id,
          //   question: currentQuestionNo,
          //   mark: currentMarkDetails.allottedMarks,
          //   answerPdfImageId: currentMarkDetails.answerPdfId,
          //   questionDefinitionId: currentMarkDetails.questionDefinitionId,
          //   timeStamps: currentTimeStamp,
          //   iconUrl: currentIcon,
          //   x: (e.clientX - containerRect.left + scrollOffsetX) / scale, // Adjust for scaling
          //   y: (e.clientY - containerRect.top + scrollOffsetY) / scale, // Adjust for scaling
          //   width: 120, // Default width
          //   height: 50,
          // },
        ]);
      }
      // setCurrentIcon(null);
      dispatch(setCurrentIcon(null));
      dispatch(setRerender());
      setIsDraggingIcon(false);
    }
  };
  console.log(icons);
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

  const handleDownload = async () => {
    

    if (!containerRef.current) return null;

    try {
      const imgElement = containerRef.current.querySelector("img");
      const rect = imgElement.getBoundingClientRect();
      // Temporarily adjust styles for capturing full content
      const container = containerRef.current;
      const originalStyle = container.style.cssText;

      // Expand the container to its full scrollable height and width
      // container.style.overflow = "visible";
      container.style.height = `${container.scrollHeight}px`;
      container.style.width = `${container.scrollWidth}px`;

      // Capture the entire container with html2canvas
      const canvas = await html2canvas(container, {
        useCORS: true, // For cross-origin images
        scale: 2, // Increase resolution for better quality
        x: rect.left - containerRef.current.getBoundingClientRect().left, // X offset relative to container
        y: rect.top - containerRef.current.getBoundingClientRect().top, // Y offset relative to container
        width: rect.width, // Width of the image
        height: rect.height, // Height of the image
      });

      // Revert the container's style after capture
      container.style.cssText = originalStyle;

      // // Get the dimensions of the image
      // const imgElement = containerRef.current.querySelector("img");
      // const rect = imgElement.getBoundingClientRect();

      // // Capture the div using html2canvas
      // const canvas = await html2canvas(containerRef.current, {
      //   useCORS: true, // For cross-origin images
      //   scale: 2, // Increase resolution
      //   // x: rect.left - containerRef.current.getBoundingClientRect().left, // X offset relative to container
      //   // y: rect.top - containerRef.current.getBoundingClientRect().top, // Y offset relative to container
      //   // width: rect.width, // Width of the image
      //   // height: rect.height, // Height of the image
      // });

      // Convert the canvas to a Blob (binary data)
      const dataUrl = canvas.toDataURL("image/png");
      
  //  // Trigger the download
  //  const link = document.createElement("a");
  //  link.href = dataUrl;
  //  link.download = "scaled_image_with_icons.png";
  //  link.click();
  //  return
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const obj = props.ImageObj;
    
      if (blob && obj) {
        const formData = new FormData();
        formData.append("image", blob, "captured_image.png");
        formData.append("imageName", obj.imageName
        );
        formData.append("bookletName", obj.bookletName);
        formData.append("subjectcode", obj.subjectCode);

        await submitImageById(formData);
      } else {
        console.error("Failed to capture the image");
      }
    } catch (error) {
      console.error("Failed to capture and download cropped image:", error);
      return null;
    }
  };
  

  return (
    <>
      <div style={{ height: "8%" }}>
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
      </div>
      {/* Image Viewer Section */}
      <button
        onClick={handleDownload}
        id="download-png"
        style={{ display: "none" }}
      >
        Download Image
      </button>
      <div
        ref={containerRef}
        style={{
          border: "1px solid #ccc",
          overflow: "auto",
          position: "relative",
          width: "100%",
          height: "92%",
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
          className="relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease-in-out",
            maxWidth: "none",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
          id="image-container"
        >
          <img
            src={`${process.env.REACT_APP_API_URL}\\${baseImageUrl}\\image_${currentIndex}.png`}
            alt="Viewer"
            className="block"
            crossOrigin="anonymous"
          />
          {/* Render the canvas for drawing */}
          <canvas
            // style={{ backgroundColor: "blue" }}
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className={`absolute top-0 z-10 pointer-events-${
              isDrawing ? "auto" : "none"
            }`}

            // style={{
            //   position: "absolute",
            //   top: 0,
            //   left: 0,
            //   pointerEvents: isDrawing ? "auto" : "none", // Only allow drawing in drawing mode
            // }}
          />
          {/* Render all placed icons */}
          {icons.map((icon, index) => {
            const isCheck = icon.iconUrl === "/check.png";
            const checkClass = isCheck
              ? "text-green-600 ring-2 ring-green-600"
              : "text-red-600 ring-2 ring-red-600";
            const blankClass = icon.iconUrl === "/blank.jpg" ? "none" : "";
            return (
              <div
                key={index}
                ref={(el) => (iconRefs.current[index] = el)}
                className={`absolute z-10 rounded-lg  p-2 transition-transform duration-200  transparent
      ${selectedIcon === index ? "border-2 border-blue-500" : ""}
    `}
                style={{
                  top: `${icon.y}px`,
                  left: `${icon.x}px`,
                  // transform: `scale(${scale})`,
                  width: `${icon.width}px`,
                  height: `${icon.height}px`,
                  transformOrigin: "top left",
                  
                }}
                onMouseDown={(e) => {
                  handleIconDragStart(index, e);
                }}
                onDoubleClick={() => handleIconDoubleClick(index)}
              >
                {/* Resizing Handle */}
                {selectedIcon === index && (
                  <div
                    className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize bg-blue-500"
                    onMouseDown={(e) => handleResizeStart(index, e)}
                  ></div>
                )}

                {/* Icon Image */}
                <img
                  src={icon.iconUrl}
                  alt="icon"
                  className="mx-auto "
                  style={{
                    width: "100%", // Ensures the image resizes with the div
                    height: "100%", // Ensures the image resizes with the div
                    objectFit: "contain", // Adjusts image to fit without distortion
                  }}
                />

                {/* Allotted Marks and Question */}
                <div
                  className=" mt-2 gap-1  text-center text-xl font-semibold text-gray-700"
                  style={{ display: blankClass }}
                >
                  <span className="mr-1">{`Q${icon.question}`}</span>→
                  <span
                    className={`ml-1 inline-flex min-w-[1.5rem] items-center justify-center font-extrabold rounded-full bg-gray-50 p-1 ${checkClass}`}
                  
                  >
                    {`${icon?.mark}`}
                  </span>
                  {/* {`Q${icon.question} → ${icon?.currentMarkDetails?.allottedMarks}`} */}
                </div>

                {/* Timestamp */}
                <div className="mt-1 text-center text-md font-extrabold  italic text-gray-700 opacity-75">
                  {icon.timeStamps || "No Timestamp"}
                </div>

                {/* Cross Button for Deletion */}
                {selectedIcon === index && (
                  <button
                    className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                    onClick={() => handleDeleteIcon(index, icon)}
                  >
                    ✖
                  </button>
                )}
              </div>
            );
          })}
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
