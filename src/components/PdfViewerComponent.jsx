// src/PDFViewer.js
import React, { useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";

// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ pdfUrl }) => {
  const canvasRef = useRef();
  const [pdfDoc, setPdfDoc] = useState(null); // State to hold the PDF document
  const [pageNumber, setPageNumber] = useState(1); // Current page number
  const [numPages, setNumPages] = useState(null); // Total number of pages

  useEffect(() => {
    const loadingTask = pdfjs.getDocument(pdfUrl);
    loadingTask.promise.then((pdf) => {
      setPdfDoc(pdf);
      setNumPages(pdf.numPages); // Get the total number of pages
      renderPage(1, pdf); // Render the first page
    });
  }, [pdfUrl]);

  const renderPage = (num, pdf) => {
    pdf.getPage(num).then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const context = canvas.getContext("2d");
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    });
  };

  const handlePageClick = (num) => {
    setPageNumber(num);
    renderPage(num, pdfDoc); // Render the clicked page
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          {Array.from({ length: numPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              style={{
                margin: "5px",
                backgroundColor: pageNumber === index + 1 ? "#007bff" : "#fff",
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
          <span>Page {pageNumber} of {numPages}</span>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;