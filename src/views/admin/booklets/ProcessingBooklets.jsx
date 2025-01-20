import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import ProcessingBookletsModal from "components/modal/ProcessingBookletsModal";
import { FcProcess } from "react-icons/fc"; // Assuming FcProcess is used for process button
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Import DataGrid and GridToolbar

const ProcessingBooklets = () => {
  const [statusMessages, setStatusMessages] = useState([]);
  const [pdfProcessingDetails, setPdfProcessingDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const { classId } = useParams();
  const navigate = useNavigate();

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

  // Table columns configuration
  const columns = [
    { field: "pdfName", headerName: "PDF Name", width: 250 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "pages", headerName: "pages", width: 110 },
  ];

  const rows = Object.entries(pdfProcessingDetails).map(
    ([pdfName, { status, pages }]) => ({
      id: pdfName,
      pdfName: pdfName,
      status: status,
      pages: pages,
    })
  );


  return (
    <div className="position-relative h-full w-full ">
      <div className="container mx-auto px-4 py-6">
        {/* Processed Files Details */}
        <div className="mt-4">
          {/* <h2 className="text-xl font-semibold mb-2">Processed Files</h2> */}
          {/* DataGrid */}
          <div style={{ height: "400px", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              components={{
                Toolbar: GridToolbar, // Optional: add toolbar
              }}
            />
          </div>
        </div>
      </div>
      <ProcessingBookletsModal statusMessages={statusMessages} />
    </div>
  );
};

export default ProcessingBooklets;
