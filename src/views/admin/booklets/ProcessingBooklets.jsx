import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import ProcessingBookletsModal from "components/modal/ProcessingBookletsModal";

const ProcessingBooklets = () => {
  const [statusMessages, setStatusMessages] = useState([]);
  const [pdfProcessingDetails, setPdfProcessingDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const { classId } = useParams();

  useEffect(() => {
    let socket = null;
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    handleStartProcessing();
  }, [classId]);

  const handleStartProcessing = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookletprocessing/processing`,
        {
          subjectCode: classId,
        }
      );
      setStatusMessages((prev) => [...prev, response?.data?.message]);
      const socket = io(
        `${process.env.REACT_APP_API_URL}/processing-${classId}`
      );
      socket.on("status", (message) => {
        setStatusMessages((prev) => [...prev, message]);

        // Handle messages indicating processed/rejected PDFs
        if (message.startsWith("Processed") || message.startsWith("Rejected")) {
          const [status, pdfFileName, totalPages] = message.split(":");
          setPdfProcessingDetails((prev) => ({
            ...prev,
            [pdfFileName.trim()]: {
              status: status.trim(),
              pages: totalPages.trim(),
            },
          }));
        }

        // Handle messages indicating extracted images
        if (message.startsWith("Extracted")) {
          const [_, imageCount, pdfName] = message.match(
            /Extracted (\d+) images from: (.*)/
          );
          setPdfProcessingDetails((prev) => ({
            ...prev,
            [pdfName]: { ...prev[pdfName], images: parseInt(imageCount) },
          }));
        }
      });

      socket.on("error", (errorMessage) => {
        setStatusMessages((prev) => [...prev, `Error: ${errorMessage}`]);
        // console.log(e)
        setIsLoading(false);
      });

      socket.on("disconnect", () => {
        setIsLoading(false);
      });
    } catch (error) {
      setStatusMessages((prev) => [...prev, "Failed to start processing."]);
      setIsLoading(false);
    }
  };

  return (
    <div className="position-relative w-full h-full">
      <div className="container mx-auto px-4 py-6">
        {/* PDF Processing Details     */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">PDF Processing Details</h2>
          <ul>
            {Object.entries(pdfProcessingDetails).map(
              ([pdfName, { status, pages, images }]) => (
                <li key={pdfName} className="mb-4">
                  <div className="font-semibold">{pdfName}</div>
                  <div>Status: {status}</div>
                  <div>Pages: {pages}</div>
                  {status === "Processed" && (
                    <div>{images} images extracted</div>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <ProcessingBookletsModal statusMessages={statusMessages} />
    </div>
  );
};

export default ProcessingBooklets;
