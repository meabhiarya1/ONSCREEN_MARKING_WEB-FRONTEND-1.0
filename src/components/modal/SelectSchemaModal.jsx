import React, { useState, useEffect, useRef } from "react";
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
  const [relationName, setRelationName] = useState("");
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  // Fetch schemas on component mount
  useEffect(() => {
    const fetchSchemaData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/schemas/getall/completed/schema`,
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
        (schema) => schema._id === selectedSchema
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
    if (
      !questionSheet ||
      !answerSheet ||
      !selectedSchemaData ||
      !relationName
    ) {
      toast.error(
        "Please select all Schema, Question, Answer Sheets, Relation name"
      );
      return;
    }

    const formData = new FormData();
    formData.append("questionPdf", questionSheet);
    formData.append("answerPdf", answerSheet);
    formData.append("schemaId", selectedSchemaData?._id);
    formData.append("subjectId", currentSubId);
    formData.append("relationName", relationName);

    try {
      setLoading(true);
      abortControllerRef.current = new AbortController(); // Create a new AbortController
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subjects/relations/createsubjectschemarel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          signal: abortControllerRef.current.signal, // Pass the AbortController's signal
        }
      );
      toast.success("Files uploaded successfully!");
      console.log(response.data);
      navigate(
        `/admin/schema/create/structure/coordinates/${response.data?._id}`
      );
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Request canceled by the user.");
        toast.error("File upload canceled.");
        setSelectedSchema("");
        setQuestionSheet(null);
        setAnswerSheet(null);
        setSelectedSchemaData(null);
        setRelationName("");
      } else {
        setSelectedSchema("");
        setQuestionSheet(null);
        setAnswerSheet(null);
        setSelectedSchemaData(null);
        setRelationName("");
        console.error("Error uploading files:", error);
        toast.error("Failed to upload files.");
        setErrorMessage("Failed to upload files.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setAnswerSheet(null);
    setQuestionSheet(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel the API request
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
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="relative m-5 w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-navy-700">
        {/* Close button */}
        <button
          className="absolute right-2 top-2 p-2 text-2xl font-bold text-gray-600 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-700"
          onClick={() => {
            handleCancel();
          }}
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
            className="mb-5 w-full rounded-lg p-2 border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
            required
            disabled={loading}
          >
            <option value=" ">Select a schema</option>
            {schemas.map((schema) => (
              <option key={schema._id} value={schema._id}>
                {schema.name}
              </option>
            ))}
          </select>

          {/* Select Questions and AnswerSheet*/}
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:bg-navy-700 sm:gap-4">
            {/* Question Sheet Upload */}
            <label
              className={`flex w-2/4 cursor-pointer items-center justify-center rounded-lg px-1 py-3 text-base font-semibold text-white shadow-md transition focus:outline-none focus:ring-2 ${
                questionSheet
                  ? "bg-green-700 hover:bg-green-800 focus:ring-green-700"
                  : "bg-indigo-600 hover:bg-indigo-800 focus:ring-indigo-400"
              }`}
            >
              <span>
                {questionSheet ? questionSheet.name : "Question Sheet"}
              </span>
              <input
                type="file"
                accept=".pdf, .tiff, .tif"
                onChange={(e) => handleFileChange(e, "question")}
                className="hidden"
                disabled={loading}
              />
            </label>

            {/* Answer Sheet Upload */}
            <label
              className={`flex w-2/4 cursor-pointer items-center justify-center rounded-lg px-1 py-3 text-base font-semibold text-white shadow-md transition focus:outline-none focus:ring-2 ${
                answerSheet
                  ? "bg-green-700 hover:bg-green-800 focus:ring-green-700"
                  : "bg-indigo-600 hover:bg-indigo-800 focus:ring-indigo-400"
              }`}
            >
              <span>{answerSheet ? answerSheet.name : "Answer Sheet"}</span>
              <input
                type="file"
                accept=".pdf, .tiff, .tif"
                onChange={(e) => handleFileChange(e, "answer")}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          <input
            type="text"
            value={relationName}
            onChange={(e) => setRelationName(e.target.value)}
            className="mb-5 w-full rounded-lg p-2 border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
            required
            placeholder="Enter Relation Name"
            disabled={loading}
          />

          {/* Submit Upload Button */}
          <button
            onClick={handleFileUpload}
            className="w-full rounded-lg bg-indigo-600 text-base font-semibold text-white shadow-md transition hover:bg-indigo-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={loading}
          >
            {loading ? (
              <div
              className={`flex h-full w-full items-center justify-center px-5 py-3 text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600"
              }`}
            >
              <svg
                className="mr-2 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Uploading...
            </div>
            ) : images?.length ? (
              "Uploaded"
            ) : (
              <div className="px-5 py-3">Upload</div>
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
                  onClick={() => {
                    setShowImageModal(false);
                  }}
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
