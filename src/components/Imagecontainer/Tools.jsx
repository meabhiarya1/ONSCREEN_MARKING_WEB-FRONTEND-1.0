import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { BiCommentAdd } from "react-icons/bi";
import { LuPencilLine } from "react-icons/lu";
import { GrUndo, GrRedo } from "react-icons/gr";
import { SketchPicker } from "react-color";
import Slider from "@mui/material/Slider";
const Tools = ({
  scalePercent,
  handleZoomMenu,
  isZoomMenuOpen,
  ZoomModal,
  zoomIn,
  zoomOut,
  isDrawing,
  setIsDrawing,
  iconModal,
  setIconModal,
  currentIcon,
  IconModal,
  setSelectedColor,
  setCurrentStrokeWidth,
  currentStrokeWidth,
}) => {
  const [pencilIconModal, setShowPencilIconModal] = useState(false);
  const [color, setColor] = useState("#fff");
  const [strokeValue, setStrokeValue] = useState(20);
  const handleChangeComplete = (newColor) => {
    setSelectedColor(newColor.hex);
    setColor(newColor.hex);
  };
  const handleSliderChange = (event, newValue) => {
    setStrokeValue(newValue);
    setCurrentStrokeWidth(newValue);
  };
  return (
    <div className="flex justify-center border bg-[#e0e2e6] p-2">
      {/* Zoom Menu */}
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
            <div className="absolute z-10 h-[200px] w-[65px] border-spacing-1 cursor-pointer overflow-auto border bg-gray-50 p-2 shadow-md">
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

      {/* Drawing and Icon Selection */}
      <div className="align-center mb-2 me-2 flex justify-between gap-1 rounded-md bg-gray-300 px-2 py-1">
        <button
          className={`flex rounded-md px-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none ${
            isDrawing
              ? "bg-gray-300 hover:bg-gray-400 "
              : "bg-white hover:bg-gray-100 "
          }`}
          onClick={() => setIsDrawing((prev) => !prev)}
        >
          <LuPencilLine />
        </button>
        <button
          className={`flex rounded-md px-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none ${"bg-white hover:bg-gray-100 "}`}
          onClick={() => {
            setShowPencilIconModal(!pencilIconModal);
          }}
        >
          <span
            className={`block transition-transform duration-300 ${
              pencilIconModal ? "rotate-180" : ""
            }`}
          >
            <IoIosArrowDown />
          </span>
        </button>
        {pencilIconModal && (
          <div className="absolute z-10 mt-9 grid w-[240px] border-spacing-1 grid-cols-1 gap-2 border bg-gray-50 p-2 shadow-md sm:grid-cols-2 md:grid-cols-3">
            {/* <div className="z-12"> */}
            <SketchPicker
              color={color}
              disableAlpha
              onChangeComplete={handleChangeComplete}
            />

            {/* Stroke Slider */}
            <div className="col-span-6 mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Stroke
              </label>
              <Slider
                value={strokeValue}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                valueLabelDisplay="auto"
                max={20}
              />
              <div className="text-right text-sm text-gray-600">
                {strokeValue}pt
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="col-span-6 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Opacity
              </label>
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
              <div className="text-right text-sm text-gray-600">54%</div>
            </div>
            {/* </div> */}
          </div>
        )}
      </div>

      {/* Add Comment Button */}
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
  );
};

export default Tools;
