// src/ImageViewer.js
import React, { useState } from "react";

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
      >
        <button onClick={zoomIn} style={{ marginRight: "5px" }}>
          Zoom In
        </button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
    </div>
  );
};

export default ImageContainer;
