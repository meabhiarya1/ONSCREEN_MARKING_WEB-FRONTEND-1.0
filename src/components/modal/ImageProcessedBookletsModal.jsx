import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import axios from "axios"; // Import Axios
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Optional for annotations

const ImageProcessedBookletsModal = ({
  pdfName,
  classId,
  SetShowProcessingImageModal,
  setPdfName,
}) => {
  const [subjectCode, setSubjectCode] = useState("");
  const [bookletName, setBookletName] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState("");

  const handleFetchPDF = async () => {
    if (!subjectCode || !bookletName) {
      setError("Subject code and booklet name are required.");
      return;
    }

    try {
      // Constructing the URL to the backend service
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/bookletprocessing/booklet?subjectCode=${subjectCode}&bookletName=${bookletName}`,
        {
          responseType: "blob", // Ensures that the response is a PDF blob
        }
      );

      // Create a URL for the PDF blob
      const pdfBlob = URL.createObjectURL(response.data);
      setPdfUrl(pdfBlob); // Set the URL of the PDF for the viewer
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError("Failed to fetch the PDF. Please try again.");
    }
  };

  useEffect(() => {
    if (pdfName) {
      setPdfName(pdfName.replace(" Pages", ""));
    }
  }, [pdfName]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Draggable bounds="parent">
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          width: "700px",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          cursor: "move",
        }}
      >
        <IoMdCloseCircleOutline
          onClick={() => SetShowProcessingImageModal(false)}
          className="absolute right-2 top-2 size-6 cursor-pointer"
        />
        <div className="relative flex w-[650px] flex-col items-center justify-center rounded-2xl border p-4 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold">
            Processed Images for {pdfName}
          </h2>
          <div>
            <div>
              <input
                type="text"
                placeholder="Enter Subject Code"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Booklet Name"
                value={bookletName}
                onChange={(e) => setBookletName(e.target.value)}
              />
              <button onClick={handleFetchPDF}>View PDF</button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* {pdfUrl && (
              <div>
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                  {Array.from(new Array(numPages), (_, index) => (
                    <Page key={index} pageNumber={index + 1} />
                  ))}
                </Document>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default ImageProcessedBookletsModal;
