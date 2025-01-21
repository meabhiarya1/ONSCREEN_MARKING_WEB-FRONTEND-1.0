import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import ProcessingBookletsModal from "components/modal/ProcessingBookletsModal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Import DataGrid and GridToolbar
import { FaRegFilePdf } from "react-icons/fa";
import ImageProcessedBookletsModal from "components/modal/ImageProcessedBookletsModal";

const ProcessingBooklets = () => {
  const [statusMessages, setStatusMessages] = useState([]);
  const [pdfProcessingDetails, setPdfProcessingDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [showProcessingModal, SetShowProcessingModal] = useState(false);
  const [showProcessingImageModal, SetShowProcessingImageModal] =
    useState(false);
  const [pdfName, setPdfName] = useState("");
  const { classId } = useParams();

  useEffect(() => {
    let socket = null;
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    SetShowProcessingModal(true);
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
            [pdfFileName?.trim()]: {
              status: status?.trim(),
              pages: totalPages?.trim(),
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

  const handlePdfImages = (pdfName) => {
    setPdfName(pdfName);
    SetShowProcessingImageModal(true);
    SetShowProcessingModal(false);
  };

  // Table columns configuration
  const columns = [
    { field: "pdfName", headerName: "PDF Name", width: 250 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "pages", headerName: "pages", width: 110 },
    {
      field: "showpdf",
      headerName: "Show PDF Images",
      width: 150,
      renderCell: (params) => (
        <div
          className="flex cursor-pointer justify-center rounded px-3 py-2 text-center font-medium text-yellow-600 "
          onClick={() => handlePdfImages(params.row.pdfName)}
        >
          <FaRegFilePdf className="size-6 text-red-500 " />
        </div>
      ),
    },
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
              slots={{ toolbar: GridToolbar }}
            />
          </div>
        </div>
      </div>
      {showProcessingModal && (
        <ProcessingBookletsModal
          statusMessages={statusMessages}
          SetShowProcessingModal={SetShowProcessingModal}
        />
      )}

      {showProcessingImageModal && (
        <ImageProcessedBookletsModal
          pdfName={pdfName}
          classId={classId}
          SetShowProcessingImageModal={SetShowProcessingImageModal}
          setPdfName={setPdfName}
        />
      )}
    </div>
  );
};

export default ProcessingBooklets;
