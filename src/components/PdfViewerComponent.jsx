// src/PDFViewer.js
import React, { useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";

// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

const PdfViewerComponent = ({ pdfUrl }) => {
  const canvasRef = useRef();
  const [pdfDoc, setPdfDoc] = useState(null); // State to hold the PDF document
  const [pageNumber, setPageNumber] = useState(1); // Current page number
  const [numPages, setNumPages] = useState(null); // Total number of pages

  // Load the PDF and set up state
  useEffect(() => {
    if (!pdfUrl) return;
    const loadingTask = pdfjs.getDocument(pdfUrl);
    console.log(loadingTask);
    loadingTask.promise
      .then((pdf) => {
        console.log(pdf);
        setPdfDoc(pdf);
        setNumPages(pdf.numPages); // Get the total number of pages
        renderPage(1, pdf); // Render the first page
      })
      .catch((error) => {
        console.error("Error loading PDF: ", error);
      });
  }, [pdfUrl]);

  // Render the current page on canvas
  const renderPage = (num, pdf) => {
    pdf
      .getPage(num)
      .then((page) => {
        const viewport = page.getViewport({ scale: 1 }); // Adjust scale as needed
        const canvas = canvasRef.current;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const context = canvas.getContext("2d");
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext);
      })
      .catch((error) => {
        console.error("Error rendering page: ", error);
      });
  };

  // Handle page navigation
  const handlePageClick = (num) => {
    setPageNumber(num);
    renderPage(num, pdfDoc); // Render the clicked page
  };

  // Previous and Next Page Navigation
  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      renderPage(pageNumber + 1, pdfDoc);
    }
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      renderPage(pageNumber - 1, pdfDoc);
    }
  };

  return (
    <div>
      {/* Canvas to render PDF page */}
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />

      {/* Navigation Buttons */}
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <div>
          {/* Previous and Next Page Buttons */}
          <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
            Previous
          </button>
          <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
            Next
          </button>
        </div>

        <div style={{ marginTop: "10px" }}>
          {/* Page Navigation (select specific page) */}
          {numPages &&
            Array.from({ length: numPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                style={{
                  margin: "5px",
                  backgroundColor:
                    pageNumber === index + 1 ? "#007bff" : "#fff",
                  color: pageNumber === index + 1 ? "#fff" : "#000",
                  border: "1px solid #007bff",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                {index + 1}
              </button>
            ))}
        </div>

        <div style={{ marginTop: "10px" }}>
          <span>
            Page {pageNumber} of {numPages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerComponent;
