import React from "react";

const CustomAddButton = () => {
  return (
    <button
      title="Add New"
      className="group cursor-pointer outline-none duration-300 hover:rotate-90"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 24 24"
        className="stroke-slate-400 group-hover:fill-slate-800 group-active:stroke-slate-200 group-active:fill-slate-600 fill-none duration-300 group-active:duration-0"
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          stroke-width="1.5"
        ></path>
        <path d="M8 12H16" stroke-width="1.5"></path>
        <path d="M12 16V8" stroke-width="1.5"></path>
      </svg>
    </button>
  );
};

export default CustomAddButton;
