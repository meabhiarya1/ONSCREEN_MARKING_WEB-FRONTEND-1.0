import React, { useEffect, useState } from "react";

const ImageProcessedBookletsModal = ({ classId, pdfName }) => {
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

        if (response.status === 400 || response.status === 404) {
          const data = await response.json();
          setErrorMessage(data.message || "Something went wrong.");
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
    <div>
      <h1>View Booklet PDF</h1>

      {/* Display error message */}
      {errorMessage && <div>{errorMessage}</div>}

      {/* Display the PDF if available */}
      {pdfUrl && (
        <div>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="PDF Viewer"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ImageProcessedBookletsModal;
