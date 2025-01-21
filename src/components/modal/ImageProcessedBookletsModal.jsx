import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "../../assets/css/pdfViewer.css";

const ImageProcessedBookletsModal = ({
  classId,
  pdfName,
  SetShowProcessingImageModal,
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!classId || !pdfName) {
      setErrorMessage("Class ID and PDF Name are required.");
      return;
    }

    const fetchPDF = async () => {
      try {
        // Construct the URL to fetch the PDF
        const url = `${process.env.REACT_APP_API_URL}/api/bookletprocessing/booklet?subjectCode=${classId}&bookletName=${pdfName}`;

        const response = await fetch(url);

        if (response?.status === 400 || response?.status === 404) {
          const data = await response.json();
          setErrorMessage(data?.message || "Something went wrong.");
          return;
        }

        // Set the PDF URL if the response is successful
        setPdfUrl(url);
        setErrorMessage(null); // Reset error message on successful fetch
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setErrorMessage("Failed to fetch PDF. Please try again.");
      }
    };

    fetchPDF();
  }, [classId, pdfName]);

  return (
    <Draggable>
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          backgroundColor: "white",
          width: "40%",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          cursor: "move",
        }}
      >
        <div>
          {/* Display error message */}
          {errorMessage && <div>{errorMessage}</div>}
          <IoMdCloseCircleOutline
            className=" z-10 my-1 size-6 cursor-pointer"
            onClick={() => SetShowProcessingImageModal(false)}
          />
          {/* Display the PDF if available */}
          {pdfUrl && (
            <div className=" ">
              <iframe
                src={pdfUrl}
                width="100%"
                height="800px"
                title="PDF Viewer"
                className="pdf-viewer"
              >
                {" "}
              </iframe>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default ImageProcessedBookletsModal;
