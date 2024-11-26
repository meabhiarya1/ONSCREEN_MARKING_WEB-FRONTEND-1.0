import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { decode, isMultiPage, pageCount } from "tiff";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { toast } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const SelectSchemaModal = ({ setShowModal, showModal }) => {
  const [schemas, setSchemas] = useState([]); // To hold the schema data
  const [selectedSchema, setSelectedSchema] = useState(""); // To store the selected schema ID
  const [selectedSchemaData, setSelectedSchemaData] = useState(null); // To store the full selected schema
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [fileName, setFileName] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Get subjectId from params
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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const fileType = file.type;
      if (fileType === "application/pdf" || fileType === "image/tiff") {
        setSelectedFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage("Only PDF and TIFF files are allowed.");
        setSelectedFile(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a valid file before uploading.");
      return;
    }
    if (images.length > 0) {
      setShowImageModal(true);
      return;
    }

    const fileType = selectedFile.type;
    if (fileType === "application/pdf") {
      extractImagesFromPDF(selectedFile);
    } else if (fileType === "image/tiff" || fileType === "image/tif") {
      extractImagesFromTIFF(selectedFile);
    } else {
      setErrorMessage(
        "Unsupported file type. Please upload a PDF or TIFF file."
      );
    }
  };

  const extractImagesFromPDF = async (file) => {
    const pdfArrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
    const pages = [];

    setLoading(true);

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      pages.push(canvas.toDataURL()); // Convert canvas to an image URL
    }
    setLoading(false);
    toast.success("Image Extracted Successfully ");
    setImages(pages);
    setShowImageModal(true);
  };

  const extractImagesFromTIFF = async (file) => {
    const tiffArrayBuffer = await file.arrayBuffer();
    const tiffPages = decode(new Uint8Array(tiffArrayBuffer)); // Decode the TIFF file into pages
    const pageDataURLs = [];

    // Loop through each page in the TIFF file
    for (const page of tiffPages) {
      const canvas = document.createElement("canvas");
      canvas.width = page.width;
      canvas.height = page.height;
      const context = canvas.getContext("2d");

      // Ensure the data length is a multiple of 4
      let imageDataArray = page.data;
      const totalPixels = page.width * page.height;

      // If data length is not correct, add padding for alpha channel
      if (imageDataArray.length !== totalPixels * 4) {
        const paddedArray = new Uint8ClampedArray(totalPixels * 4);
        for (let i = 0, j = 0; i < imageDataArray.length; i += 3, j += 4) {
          paddedArray[j] = imageDataArray[i]; // R
          paddedArray[j + 1] = imageDataArray[i + 1]; // G
          paddedArray[j + 2] = imageDataArray[i + 2]; // B
          paddedArray[j + 3] = 255; // Alpha (set to fully opaque)
        }
        imageDataArray = paddedArray;
      }

      // Create ImageData object with corrected array
      const imageData = new ImageData(imageDataArray, page.width, page.height);
      context.putImageData(imageData, 0, 0);

      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL();
      pageDataURLs.push(dataURL);
    }

    setImages(pageDataURLs); // Set the images for rendering in the component
    setShowImageModal(true); // Show the modal to display images
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!showModal) return null; // Don't render modal if showModal is false

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {/* Close button */}
        <button
          className="absolute right-2 top-2 text-2xl font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={() => setShowModal(false)}
        >
          &times;
        </button>

        {/* Modal content */}
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">
            Please select a schema:
          </h3>

          {/* Dropdown for selecting schema */}
          <select
            value={selectedSchema}
            onChange={(e) => setSelectedSchema(e.target.value)} // Set selected schema
            className="mb-5 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select a schema</option>
            {schemas.map((schema) => (
              <option key={schema.id} value={schema.id}>
                {schema.name}
              </option>
            ))}
          </select>

          {/* Base */}

          <div className="mb-6 flex items-center space-x-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            {/* Select Question Button */}
            <label className="flex w-3/4 cursor-pointer items-center justify-between rounded-lg bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <span>{fileName ? fileName : "Select Question"}</span>
              <input
                type="file"
                accept=".pdf, .tiff, .tif"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Submit Upload Button */}
            <button
              onClick={handleFileUpload}
              className="w-1/4 rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <MoonLoader color="#3498db" loading={loading} size={20} />
                </div>
              ) : images?.length ? (
                "Show"
              ) : (
                "Upload"
              )}
            </button>

          </div>

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
                    onClick={prevImage}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-800"
                  >
                    Previous
                  </button>

                  {/* Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleSubmit} // Call handleSubmit on click
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
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
      </div>
    </div>
  );
};


export default SelectSchemaModal;
