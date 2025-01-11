import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
  questionDone,
  formData,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [questionsPdfPath, setQuestionsPdfPath] = useState(undefined);
  const [answersPdfPath, setAnswersPdfPath] = useState(undefined);
  const [countQuestions, setCountQuestions] = useState(0);
  const [countAnswers, setCountAnswers] = useState(0);
  const [checkboxStatus, setCheckboxStatus] = useState({}); // Object to hold checkbox status for each image
  const { id } = useParams();

  // console.log(formData);

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

  useEffect(() => {
    setCheckboxStatus({});
    if (prefilledQuestionTobeShown?.length !== 0) {
      if (!showAnswerModel) {
        // Extract the numbers using map and regex
        const extractedNumbersArray =
          prefilledQuestionTobeShown[0].questionImages
            .map((image) => {
              const match = image.match(/image_(\d+)\.png/);
              return match ? parseInt(match[1], 10) : null; // Extract and convert to number
            })
            .filter((num) => num !== null); // Remove any null values

        extractedNumbersArray.map((num) => {
          setCheckboxStatus((prevStatus) => ({
            ...prevStatus,
            [num]: true, // Set the checkbox status for the extracted numbers
          }));
          setFormData((prevFormData) => ({
            ...prevFormData,
            questionImages: [
              ...prevFormData.questionImages,
              `image_${num}.png`,
            ],
          }));
        });
      } else {
        const extractedNumbersArray =
          prefilledQuestionTobeShown[0]?.answerImages
            .map((image) => {
              const match = image.match(/image_(\d+)\.png/);
              return match ? parseInt(match[1], 10) : null; // Extract and convert to number
            })
            .filter((num) => num !== null); // Remove any null values

        extractedNumbersArray.map((num) => {
          setCheckboxStatus((prevStatus) => ({
            ...prevStatus,
            [num]: true, // Set the checkbox status for the extracted numbers
          }));
          setFormData((prevFormData) => ({
            ...prevFormData,
            answerImages: [...prevFormData.answerImages, `image_${num}.png`],
          }));
        });
      }
    }
  }, [setCheckboxStatus, showAnswerModel]);

  const prefilledQuestionTobeShown = questionDone?.filter(
    (question) => question.questionId === questionId
  );

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
          if (updatedCheckboxStatus[index]) {
            // Add image if it's not already included
            updatedImages = questionImages.includes(imageName)
              ? questionImages
              : [...questionImages, imageName];
          } else {
            // Remove image
            updatedImages = questionImages.filter((img) => img !== imageName);
          }

          return {
            ...prevFormData,
            questionId: questionId,
            questionImages: updatedImages,
            courseSchemaRelationId: id,
          };
        } else {
          // Toggle image in answerImages
          if (updatedCheckboxStatus[index]) {
            // Add image if it's not already included
            updatedImages = answerImages.includes(imageName)
              ? answerImages
              : [...answerImages, imageName];
          } else {
            // Remove image
            updatedImages = answerImages.filter((img) => img !== imageName);
          }

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

  // console.log(questionDone)

  const handleQuestionConfirm = () => {
    if (!showAnswerModel && formData?.questionImages?.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    setShowAnswerModel(!showAnswerModel);
    setCheckboxStatus({});
    setCurrentImageIndex(1);
  };

  const handleDeselectAll = () => {
    if (showImageModal && !showAnswerModel) {
      setCheckboxStatus({});
      setFormData((prevFormData) => ({
        ...prevFormData,
        questionImages: [],
      }));
    } else if (showImageModal && showAnswerModel) {
      setCheckboxStatus({});
      setFormData((prevFormData) => ({
        ...prevFormData,
        answerImages: [],
      }));
    }
  };

  return (
    <div>
      {/* Question Image Modal */}
      {showImageModal && !showAnswerModel && (
        <div className="bg-black fixed inset-0 z-50 flex  items-center justify-center bg-opacity-50 backdrop-blur-md">
          <div
            className="relative rounded-lg border w-11/12 sm:w-8/12 lg:w-6/12 xl:w-4/12 h-11/12 border-gray-900 bg-white p-6 m-5 shadow-lg dark:bg-navy-700"
          >
            <div className="mb-4 flex items-center justify-between dark:bg-navy-700">
              <div className="text-lg font-bold text-gray-800 dark:text-white ">
                Questions PDF
              </div>
              {isAvailable && (
                <div
                  className="text-md cursor-pointer rounded-lg bg-indigo-700 px-3 py-2 font-semibold text-white hover:text-gray-600"
                  onClick={handleDeselectAll}
                >
                  Deselect All
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              className="absolute right-0 top-0 pl-2 pr-1 text-3xl font-bold text-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => {
                setShowImageModal(false);
                setQuestionsPdfPath(questionsPdfPath);
                setAnswersPdfPath(undefined);
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  questionImages: [],
                }));
              }}
            >
              &times;
            </button>

            {/* Image Display */}
            <img
              src={`${process.env.REACT_APP_API_URL}/uploadedPdfs/extractedQuestionPdfImages/${questionsPdfPath}/image_${currentImageIndex}.png`} // Use the current image URL
              alt={`Slide ${currentImageIndex}`}
              className={`mb-2 h-[350px] sm:h-[650px] xl:h-[670px] w-full rounded-lg object-contain overflow-auto cursor-pointer ${
                checkboxStatus[currentImageIndex]
                  ? "border-2 border-green-700 shadow-lg hover:shadow-2xl"
                  : ""
              }`}
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
                        <strong className="font-bold text-gray-700 dark:text-white">
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
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
          <div
            className="relative rounded-lg border w-11/12 sm:w-8/12 lg:w-6/12 xl:w-4/12 h-11/12 border-gray-900 bg-white p-6 m-5 shadow-lg dark:bg-navy-700"
          >
            <div className="mb-4 flex items-center justify-between ">
              <div className="text-lg font-bold text-gray-800 dark:text-white ">
                Answers PDF
              </div>
              {isAvailable && (
                <div
                  className="text-md cursor-pointer rounded-lg bg-indigo-700 px-3 py-2 font-semibold text-white hover:text-gray-600"
                  onClick={handleDeselectAll}
                >
                  Deselect All
                </div>
              )}
            </div>
            {/* Close button */}
            <button
              className="absolute right-0 top-0 pl-2 pr-1 text-3xl font-bold text-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => {
                setShowAnswerModel(false);
                setAnswersPdfPath(undefined);
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  answerImages: [],
                  questionImages: [],
                }));
              }}
            >
              &times;
            </button>

            {/* Answer Image Display */}

            <img
              src={`${process.env.REACT_APP_API_URL}/uploadedPdfs/extractedAnswerPdfImages/${answersPdfPath}/image_${currentImageIndex}.png`}
              alt={`Slide ${currentImageIndex}`}
              className={`mb-2 h-[350px] sm:h-[650px] xl:h-[670px] w-full rounded-lg object-contain overflow-auto cursor-pointer ${
                checkboxStatus[currentImageIndex]
                  ? "border-2 border-green-700"
                  : ""
              }`}
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
                        {/* <input
                          type="checkbox"
                          className="size-4 cursor-pointer rounded border-gray-300 "
                          id="Option"
                          checked={
                            (
                              prefilledQuestionTobeShown.length > 0 &&
                              prefilledQuestionTobeShown[0].answerImages
                                ? prefilledQuestionTobeShown[0].answerImages.includes(
                                    `image_${currentImageIndex}.png`
                                  )
                                : checkboxStatus[currentImageIndex] === true
                            )
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
                        <strong className="font-bold text-gray-700 dark:text-white">
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
