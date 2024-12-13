import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decode } from "tiff";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { toast } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";
import { GiCrossMark } from "react-icons/gi";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const SelectSchemaModal = ({ setShowModal, showModal, currentSubId }) => {
  const [schemas, setSchemas] = useState([]); // To hold the schema data
  const [selectedSchema, setSelectedSchema] = useState(""); // To store the selected schema ID
  const [selectedSchemaData, setSelectedSchemaData] = useState(null); // To store the full selected schema
  const [errorMessage, setErrorMessage] = useState("");
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [questionSheet, setQuestionSheet] = useState(null);
  const [answerSheet, setAnswerSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch schemas on component mount
  useEffect(() => {
    const fetchSchemaData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/schemas/getall/schema`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSchemas(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSchemaData();
  }, []);

  // Update selectedSchemaData when selectedSchema changes
  useEffect(() => {
    if (selectedSchema) {
      const schemaData = schemas.find(
        (schema) => schema.name === selectedSchema
      );
      setSelectedSchemaData(schemaData); // Set the full schema data
    }
  }, [selectedSchema, schemas]);

  // Handle submit function
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedSchema === "") {
      toast.error("Please select a schema");
      return;
    }

    navigate(`/admin/schema/create/${selectedSchemaData._id}`, {
      state: { schema: selectedSchemaData, images },
    });
    setShowModal(false); // Close the modal
  };

  // console.log(currentSubId)
  // Handle file selection

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "question") {
        setQuestionSheet(file);
      } else if (type === "answer") {
        setAnswerSheet(file);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!questionSheet || !answerSheet || !selectedSchemaData) {
      toast.error("Please select all Schema,Question, Answer Sheets");
      return;
    }

    const formData = new FormData();
    formData.append("questionPdf", questionSheet);
    formData.append("answerPdf", answerSheet);
    formData.append("schemaId", selectedSchemaData._id);
    formData.append("subjectId", currentSubId);

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subjects/relations/createsubjectschemarel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Files uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files.");
      setErrorMessage("Failed to upload files.");
    } finally {
      setLoading(false);
    }
  };

  // const nextImage = () => {
  //   setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };

  // const prevImage = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex === 0 ? images.length - 1 : prevIndex - 1
  //   );
  // };

  if (!showModal) return null;

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {/* Close button */}
        <button
          className="absolute right-2 top-2 p-2 text-2xl font-bold text-gray-600 hover:text-red-700 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={() => setShowModal(false)}
        >
          <GiCrossMark />
        </button>

        {/* Modal content */}
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">
            Please select a schema:
          </h3>
          <select
            value={selectedSchema}
            onChange={(e) => setSelectedSchema(e.target.value)}
            className="mb-5 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select a schema</option>
            {schemas.map((schema) => (
              <option key={schema._id} value={schema._id}>
                {schema.name}
              </option>
            ))}
          </select>

          {/* Selec Questions Sheet*/}
          <div className="mb-6 flex items-center space-x-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <label className="flex w-3/4 cursor-pointer items-center justify-between rounded-lg bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <span>
                {questionSheet ? questionSheet.name : "Question Sheet"}
              </span>
              <input
                type="file"
                accept=".pdf, .tiff, .tif"
                onChange={(e) => handleFileChange(e, "question")}
                className="hidden"
              />
            </label>

            <label className="flex w-3/4 cursor-pointer items-center justify-between rounded-lg bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <span>{answerSheet ? answerSheet.name : "Answer Sheet"}</span>
              <input
                type="file"
                accept=".pdf, .tiff, .tif"
                onChange={(e) => handleFileChange(e, "answer")}
                className="hidden"
              />
            </label>
          </div>
          {/* Submit Upload Button */}
          <button
            onClick={handleFileUpload}
            className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <MoonLoader color="#3498db" loading={loading} size={20} />
              </div>
            ) : images?.length ? (
              "Uploaded"
            ) : (
              "Upload"
            )}
          </button>

          {/* Error message */}
          {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}

          {/* Image Modal */}
          {showImageModal && (
            <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
              <div
                className="relative h-[850px] w-[700px] rounded-lg bg-white p-6 shadow-lg"
                style={{ maxWidth: "700px", maxHeight: "850px" }}
              >
                <span className="absolute top-2 font-bold text-gray-600 dark:text-gray-400">
                  {currentImageIndex + 1} / {images.length}
                </span>
                {/* Close button */}
                <button
                  className="absolute right-2 top-2 text-2xl font-bold text-gray-600 hover:text-gray-900"
                  onClick={() => setShowImageModal(false)}
                >
                  &times;
                </button>

                {/* Image Display */}
                <img
                  src={images[currentImageIndex]}
                  alt={`Slide ${currentImageIndex + 1}`}
                  className="mb-1 h-[750px] w-full rounded-lg object-contain"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />

                {/* Pagination Controls */}
                <div className="flex items-center justify-between">
                  <button
                    // onClick={prevImage}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
                  >
                    Previous
                  </button>

                  {/* Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button
                      // onClick={handleSubmit}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
                      Confirm
                    </button>
                  </div>
                  <button
                    // onClick={nextImage}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectSchemaModal;
