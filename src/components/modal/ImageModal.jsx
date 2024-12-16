import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ImageModal = ({
  showImageModal,
  setShowImageModal,
  setImages,
  images,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [questionsPdfPath, setQuestionsPdfPath] = useState(undefined);
  const [answerPdfPath, setAnswerPdfPath] = useState(undefined);
  const [countQuestions, setCountQuestions] = useState(0);

  const { id } = useParams();

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === countQuestions ? 1 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? countQuestions : prevIndex - 1
    );
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
      } catch (error) {
        console.log("Error fetching images:", error);
      }
    };
    fetchedData();
  }, [id, setImages]);

  //   http://192.168.1.30:8000/uploadedPdfs/extractedAnswerPdfImages/1733918136981-answer9/image_2.png

  return (
    <div>
      {/* Image Modal */}
      {showImageModal && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="absolute right-2 top-2">{currentImageIndex}</div>
          <div
            className="relative h-[850px] w-[700px] rounded-lg bg-white p-6 shadow-lg"
            style={{ maxWidth: "700px", maxHeight: "850px" }}
          >
            {/* Close button */}
            <button
              className="absolute right-2 top-2 text-2xl font-bold text-gray-600 hover:text-gray-900"
              onClick={() => {
                setShowImageModal(false);
              }}
            >
              &times;
            </button>

            {/* Image Display */}
            <img
              src={`http://192.168.1.30:8000/uploadedPdfs/extractedAnswerPdfImages/1733918136981-answer9/image_${
                currentImageIndex + 1
              }.png`} // Use the current image URL
              alt={`Slide ${currentImageIndex + 1}`}
              className="mb-1 h-[750px] w-full rounded-lg object-contain"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
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
                <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                  Confirm
                </button>
              </div>

              <button
                onClick={nextImage}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageModal;
