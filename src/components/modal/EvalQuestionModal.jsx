import React, { useState } from "react";
import { GiCrossMark } from "react-icons/gi";
const EvalQuestionModal = ({ show, onHide }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [questionsPdfPath, setQuestionsPdfPath] = useState(undefined);
  const [answersPdfPath, setAnswersPdfPath] = useState(undefined);
  const [countQuestions, setCountQuestions] = useState(0);
  const [countAnswers, setCountAnswers] = useState(0);
  return (
    <div>
      <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative w-full max-w-lg scale-95 transform rounded-lg bg-white p-8 shadow-2xl transition-all duration-300 dark:bg-navy-700 sm:scale-100">
          <button
            className="absolute right-4 top-4 text-2xl text-gray-700 hover:text-red-700 focus:outline-none"
            onClick={() => {
              onHide();
            }}
          >
            <GiCrossMark />
          </button>
          <div className="bg-black fixed inset-0 z-50 flex  items-center justify-center bg-opacity-50">
            <div
              className="relative h-[950px] w-[700px] rounded-lg border border-gray-900 bg-white p-6 shadow-lg"
              style={{ maxWidth: "700px", maxHeight: "900px" }}
            >
              <div className="mb-4 flex items-center justify-between ">
                <div className="text-lg font-bold text-gray-800 dark:text-white ">
                  Questions PDF
                </div>

                <div
                  className="text-md cursor-pointer rounded-lg bg-indigo-700 px-3 py-2 font-semibold text-white hover:text-gray-600"
                  // onClick={handleDeselectAll}
                >
                  Deselect All
                </div>
              </div>

              {/* Close button */}
              <button
                className="absolute right-0 top-0 pl-2 pr-1 text-3xl font-bold text-gray-600 hover:text-gray-900"
                onClick={() => {
                  onHide();
                }}
              >
                &times;
              </button>

              {/* Image Display */}
              <img
                src={`http://192.168.1.39:8000/uploads/extractedAnswerPdfImages/1733822112065-CS603_1119_page-1/image_1.pn`} // Use the current image URL
                // alt={`Slide ${currentImageIndex}`}
                // className={`mb-2 h-[750px] w-full rounded-lg object-contain ${
                //   checkboxStatus[currentImageIndex]
                //     ? "border-2 border-green-700 shadow-lg hover:shadow-2xl "
                //     : ""
                // }`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  cursor: "pointer",
                }}
                // onClick={() => {
                //   handleSelectedImage(
                //     currentImageIndex,
                //     `image_${currentImageIndex}.png`
                //   );
                // }}
              />

              {/* Pagination Controls */}
              <div className="flex items-center justify-between">
                <button
                  //   onClick={prevImage}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
                >
                  Previous
                </button>
                {/* Confirm Button */}
                <div className="flex justify-center space-x-4">
                  <button
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    // onClick={handleQuestionConfirm}
                  >
                    Confirm
                  </button>
                </div>
                <button
                  //   onClick={nextImage}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
                >
                  Next
                </button>{" "}
                {/* Current Page Index Centered at Top */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 transform rounded-lg px-2 py-1 text-sm font-bold text-gray-700">
                  <fieldset>
                    <div className="mt-0 space-y-2">
                      <label
                        htmlFor="Option"
                        className="flex cursor-pointer items-start gap-4"
                      >
                        <div className="flex items-center">
                          &#8203;
                          {/* <input
                          type="checkbox"
                          className="size-4 cursor-pointer rounded border-gray-300 "
                          id="Option"
                          checked={
                            prefilledQuestionTobeShown.length > 0 &&
                            prefilledQuestionTobeShown[0].questionImages
                              ? prefilledQuestionTobeShown[0].questionImages.includes(
                                  `image_${currentImageIndex}.png`
                                )
                              : checkboxStatus[currentImageIndex] === true
                              ? true
                              : false
                          }
                          onClick={() => {
                            handleSelectedImage(
                              currentImageIndex,
                              `image_${currentImageIndex}.png`
                            );
                          }}
                        /> */}
                        </div>

                        <div>
                          <strong className="font-bold font-medium text-gray-700">
                            {" "}
                            Page : {currentImageIndex}{" "}
                          </strong>
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvalQuestionModal;
