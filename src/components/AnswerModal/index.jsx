import React from "react";
import { IoIosArrowForward } from "react-icons/io";
const index = () => {
  return (
    <div className="z-999 h-[20vh] w-[10vw] bg-white shadow-xl overflow-auto">
      <div className="cursor-pointer border bg-gray-300 sticky top-0">Select Question</div>

      {/* First question with arrow on hover */}
      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>

      {/* Rest of the questions with the same logic */}
      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>

      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>

      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>
      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>

      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>
      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>

      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>
      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>

      <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
        <span>Q1</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>
    </div>
  );
};

export default index;
