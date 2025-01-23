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
  const [showAI, setShowAI] = useState(false);
  const handleChangeComplete = (newColor) => {
    setSelectedColor(newColor.hex);
    setColor(newColor.hex);
  };
  const handleSliderChange = (event, newValue) => {
    setStrokeValue(newValue);
    setCurrentStrokeWidth(newValue);
  };
  const aiEvaluatorHandler = () => {
    setShowAI(!showAI);
  };
  return (
    <div className="flex h-full justify-center border bg-[#e0e2e6] p-2">
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

      <button
        style={{ opacity: showAI ? "0.5" : 1 }}
        class="border-transparent group relative flex aspect-square h-[var(--sz-btn)] w-[var(--sz-btn)] cursor-pointer items-center justify-center rounded-xl border border-solid bg-blue-200 bg-[linear-gradient(45deg,#3b82f6,#2563eb)] outline-0 transition-transform duration-200 [--gen-sz:calc(var(--space)*1.5)] [--space:calc(var(--sz-btn)/6)] [--sz-btn:40px] [--sz-text:calc(var(--sz-btn)-var(--gen-sz))] [box-shadow:#3c40434d_0_1px_2px_0,#3c404326_0_2px_6px_2px,#0000004d_0_30px_60px_-30px,#34343459_0_-2px_6px_0_inset] active:scale-[0.95]"
        onClick={aiEvaluatorHandler}
      >
        <svg
          class="absolute left-[calc(var(--sz-text)/7)] top-[calc(var(--sz-text)/7)] z-10 h-[var(--gen-sz)] w-[var(--gen-sz)] animate-pulse overflow-visible text-[#93c5fd] transition-all duration-300 group-hover:left-[calc(var(--sz-text)/4)] group-hover:top-[calc(calc(var(--gen-sz))/2)] group-hover:h-[var(--sz-text)] group-hover:w-[var(--sz-text)] group-hover:text-white"
          stroke="none"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
          ></path>
        </svg>
        <span class="font-extrabold leading-none text-white transition-all duration-200 [font-size:var(--sz-text)] group-hover:opacity-0">
          AI
        </span>
      </button>
    </div>
  );
};

export default Tools;
