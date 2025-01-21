import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { IoMdCloseCircleOutline } from "react-icons/io";
import * as pdfjsLib from "pdfjs-dist";
import "../../assets/css/pdfViewer.css";

const ImageProcessedBookletsModal = ({
  classId,
  pdfName,
  SetShowProcessingImageModal,
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(0); // Track the total number of pages

  useEffect(() => {
    if (!classId || !pdfName) {
      setErrorMessage("Class ID and PDF Name are required.");
      return;
    }

    const fetchPDF = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/bookletprocessing/booklet?subjectCode=${classId}&bookletName=${pdfName}`;
        const response = await fetch(url);

        if (response?.status === 400 || response?.status === 404) {
          const data = await response.json();
          setErrorMessage(data?.message || "Something went wrong.");
          return;
        }

        setPdfUrl(url);
        setErrorMessage(null); // Reset error message on successful fetch
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setErrorMessage("Failed to fetch PDF. Please try again.");
      }
    };

    fetchPDF();
  }, [classId, pdfName]);

  useEffect(() => {
    if (pdfUrl) {
      const loadPDF = async () => {
        try {
          const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
          setPdfData(pdf);
          setTotalPages(pdf.numPages); // Set the total number of pages
          setCurrentPage(1)
        } catch (error) {
          console.error("Error loading PDF:", error);
          setErrorMessage("Failed to load PDF.");
        }
      };
      loadPDF();
    }
  }, [pdfUrl]);

  const renderPDF = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) {
      console.error("Invalid page number:", pageNum);
      return; // Exit early if the page number is invalid
    }

    if (pdfData) {
      const canvasContainer = document.getElementById("canvasContainer");
      canvasContainer.innerHTML = ""; // Clear the previous canvas before rendering the new one

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Render the specified page
      pdfData.getPage(pageNum).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        page.render({
          canvasContext: context,
          viewport: viewport,
        });

        canvasContainer.appendChild(canvas); // Add the new canvas to the container
      });
    }
  };

  useEffect(() => {
    if (pdfData && currentPage) {
      renderPDF(currentPage); // Render the current page
    }
  }, [pdfData, currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Draggable>
      <div
        style={{
          position: "absolute",
          top: "2%",
          left: "52%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          // backgroundColor: "white",
          width: "40%",
          padding: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          cursor: "move",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="dark:bg-navy-700 bg-white"
      >
        {" "}
        {/* Close button positioned at the top-right */}
        <IoMdCloseCircleOutline
          className="z-50 size-6 cursor-pointer dark:text-white"
          style={{
            position: "absolute",
            top: "10px", // Adjust the distance from the top
            right: "15px", // Adjust the distance from the right
          }}
          onClick={() => SetShowProcessingImageModal(false)}
        />
        <div style={{ position: "relative" }}>
          {/* Display error message */}
          {errorMessage && <div>{errorMessage}</div>}
          <div className="flex justify-evenly text-gray-700 dark:text-white">
            {pdfUrl && (
              <p className="my-2 text-sm">
                Page {currentPage} of {totalPages}
              </p>
            )}

            {pdfUrl && (
              <p className="my-2 text-sm text-gray-700 dark:text-white">
                {" "}
                <span className="text-dark mr-1 text-sm font-bold">
                  PDF Name :
                </span>{" "}
                {pdfName}
              </p>
            )}
          </div>

          {/* Display loading message */}
          {!pdfUrl && <div>Loading...</div>}

          {/* Display the PDF if available */}
          {pdfUrl && (
            <div id="canvasContainer">
              {/* Each page will be rendered in a new canvas */}
            </div>
          )}

          {/* Navigation buttons for next/previous pages */}
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              gap: "10px",
            }}
          >
            <button
              class="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <span class="shadow"></span>
              <span class="edge"></span>
              <div class="front">
                <span>Previous</span>
              </div>
            </button>

            <button
              class="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <span class="shadow"></span>
              <span class="edge"></span>
              <div class="front">
                <span>Next</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default ImageProcessedBookletsModal;
