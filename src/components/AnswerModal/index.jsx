import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
const AnswerModal = () => {
  const [modalshow, setModalShow] = useState(false);
  const subModalHandler = () => {
    setModalShow(true);
  };
  const questions = Array.from({ length: 10 }, (_, index) => {
    return (
      <div
        className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600"
        key={index}
        onClick={subModalHandler}
      >
        <span>{`Q${index + 1}`}</span>
        <span className="invisible group-hover:visible">
          <IoIosArrowForward />
        </span>
      </div>
    );
  });

  return (
    <div
      className={`z-999 flex h-[20vh] ${
        modalshow ? "w-[15vw]" : "w-[10vw]"
      } overflow-auto bg-white shadow-xl`}
    >
      <div>
        <div className="sticky top-0 cursor-pointer border bg-gray-300 ">
          Select Question
        </div>
        {questions}
      </div>
      <div>
        {modalshow && (
          <>
            <div className="sticky top-0 cursor-pointer border bg-gray-300 ">
              Select Marks
            </div>

            <div className="group flex cursor-pointer items-center justify-between border hover:bg-gray-600">
              <span>{``}</span>
              <span className="invisible group-hover:visible">
                <IoIosArrowForward />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnswerModal;
