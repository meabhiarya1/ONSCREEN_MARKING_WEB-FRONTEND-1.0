import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ImageModal = ({
  showImageModal,
  setShowImageModal,
  questionId,
  handleSubmitButton,
  setFormData,
  showAnswerModel,
  setShowAnswerModel,
  handleUpdateButton,
  isAvailable,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [questionsPdfPath, setQuestionsPdfPath] = useState(undefined);
  const [answersPdfPath, setAnswersPdfPath] = useState(undefined);
  const [countQuestions, setCountQuestions] = useState(0);
  const [countAnswers, setCountAnswers] = useState(0);

  const [checkboxStatus, setCheckboxStatus] = useState({}); // Object to hold checkbox status for each image
  const { id } = useParams();

  const nextImage = () => {
    if (showAnswerModel) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === countAnswers ? 1 : prevIndex + 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === countQuestions ? 1 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (showAnswerModel) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 1 ? countAnswers : prevIndex - 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 1 ? countQuestions : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/relations/getsubjectbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setQuestionsPdfPath(response?.data?.questionPdfPath);
        setCountQuestions(response?.data?.countOfQuestionImages);
        setAnswersPdfPath(response?.data?.answerPdfPath);
        setCountAnswers(response?.data?.countOfAnswerImages);
      } catch (error) {
        console.log("Error fetching images:", error);
      }
    };
    fetchedData();
  }, [id]);

  const handleSelectedImage = (index, imageName) => {
    setCheckboxStatus((prevStatus) => {
      const updatedCheckboxStatus = {
        ...prevStatus,
        [index]: !prevStatus[index], // Toggle the checkbox state
      };

      setFormData((prevFormData) => {
        // Initialize arrays safely
        const questionImages = prevFormData.questionImages || [];
        const answerImages = prevFormData.answerImages || [];

        let updatedImages;

        if (!showAnswerModel) {
          // Toggle image in questionImages
          updatedImages = updatedCheckboxStatus[index]
            ? [...questionImages, imageName] // Add image
            : questionImages.filter((img) => img !== imageName); // Remove image

          return {
            ...prevFormData,
            questionId: questionId,
            questionImages: updatedImages,
            courseSchemaRelationId: id,
          };
        } else {
          // Toggle image in answerImages
          updatedImages = updatedCheckboxStatus[index]
            ? [...answerImages, imageName] // Add image
            : answerImages.filter((img) => img !== imageName); // Remove image

          return {
            ...prevFormData,
            questionId: questionId,
            answerImages: updatedImages,
            courseSchemaRelationId: id,
          };
        }
      });

      return updatedCheckboxStatus; // Update the checkbox status
    });
  };

  const handleQuestionConfirm = () => {
    setShowAnswerModel(!showAnswerModel);
    setCheckboxStatus(false);
    setCurrentImageIndex(1);
  };

  return (
    <div>
      {/* Question Image Modal */}
      {showImageModal && !showAnswerModel && (
        <div className="bg-black fixed inset-0 z-50 flex  items-center justify-center bg-opacity-50">
          <div
            className="relative h-[850px] w-[700px] rounded-lg border border-gray-900 bg-white p-6 shadow-lg"
            style={{ maxWidth: "700px", maxHeight: "850px" }}
          >
            {/* Close button */}
            <button
              className="absolute right-2 top-2 text-2xl font-bold text-gray-600 hover:text-gray-900"
              onClick={() => {
                setShowImageModal(false);
                setQuestionsPdfPath((questionsPdfPath));
                setAnswersPdfPath(undefined);
              }}
            >
              &times;
            </button>

            {/* Image Display */}
            <img
              src={`${process.env.REACT_APP_API_URL}/uploadedPdfs/extractedQuestionPdfImages/${questionsPdfPath}/image_${currentImageIndex}.png`} // Use the current image URL
              alt={`Slide ${currentImageIndex}`}
              className={`mb-1 h-[750px] w-full rounded-lg object-contain ${
                checkboxStatus[currentImageIndex]
                  ? "border-2 border-green-700"
                  : ""
              }`}
              style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
              onClick={() => {
                handleSelectedImage(
                  currentImageIndex,
                  `image_${currentImageIndex}.png`
                );
              }}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevImage}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
                Previous
              </button>
              {/* Confirm Button */}
              <div className="flex justify-center space-x-4">
                <button
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                  onClick={handleQuestionConfirm}
                >
                  Confirm
                </button>
              </div>
              <button
                onClick={nextImage}
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
                        <input
                          type="checkbox"
                          className="size-4 cursor-pointer rounded border-gray-300 "
                          id="Option"
                          checked={checkboxStatus[currentImageIndex] || false}
                          onClick={() => {
                            handleSelectedImage(
                              currentImageIndex,
                              `image_${currentImageIndex}.png`
                            );
                          }}
                        />
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
      )}

      {/* Answer Image Modal */}
      {showAnswerModel && (
        <div className="bg-black fixed inset-0 z-50 flex  items-center justify-center bg-opacity-50">
          <div
            className="relative h-[850px] w-[700px] rounded-lg border border-gray-900 bg-white p-6 shadow-lg"
            style={{ maxWidth: "700px", maxHeight: "850px" }}
          >
            {/* Close button */}
            <button
              className="absolute right-2 top-2 text-2xl font-bold text-gray-600 hover:text-gray-900"
              onClick={() => {
                setShowAnswerModel(false);
                setAnswersPdfPath(undefined);
              }}
            >
              &times;
            </button>

            {/* Answer Image Display */}

            <img
              src={`${process.env.REACT_APP_API_URL}/uploadedPdfs/extractedAnswerPdfImages/${answersPdfPath}/image_${currentImageIndex}.png`}
              alt={`Slide ${currentImageIndex}`}
              className={`mb-1 h-[750px] w-full rounded-lg object-contain ${
                checkboxStatus[currentImageIndex]
                  ? "border-2 border-green-700"
                  : ""
              }`}
              style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
              onClick={() => {
                handleSelectedImage(
                  currentImageIndex,
                  `image_${currentImageIndex}.png`
                );
              }}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevImage}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
                Previous
              </button>
              {/* Confirm Button */}
              <div className="flex justify-center space-x-4">
                <button
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                  onClick={() => {
                    isAvailable
                      ? handleUpdateButton(questionId)
                      : handleSubmitButton();
                  }}
                >
                  {isAvailable ? "Update" : "Submit"}
                </button>
              </div>
              <button
                onClick={nextImage}
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
                        <input
                          type="checkbox"
                          className="size-4 cursor-pointer rounded border-gray-300 "
                          id="Option"
                          checked={checkboxStatus[currentImageIndex] || false}
                          onClick={() => {
                            handleSelectedImage(
                              currentImageIndex,
                              `image_${currentImageIndex}.png`
                            );
                          }}
                        />
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
      )}
    </div>
  );
};

export default ImageModal;
