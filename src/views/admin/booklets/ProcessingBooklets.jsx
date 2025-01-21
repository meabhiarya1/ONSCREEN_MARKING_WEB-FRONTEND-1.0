import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import ProcessingBookletsModal from "components/modal/ProcessingBookletsModal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Import DataGrid and GridToolbar
import { FaRegFilePdf } from "react-icons/fa";
import ImageProcessedBookletsModal from "components/modal/ImageProcessedBookletsModal";
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ProcessingBooklets = () => {
  const [statusMessages, setStatusMessages] = useState([]);
  const [pdfProcessingDetails, setPdfProcessingDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [showProcessingModal, SetShowProcessingModal] = useState(false);
  const [showProcessingImageModal, SetShowProcessingImageModal] =
    useState(false);
  const [pdfName, setPdfName] = useState("");
  const { classId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the `dark` mode is applied to the `html` element
    const htmlElement = document.body; // `html` element
    const checkDarkMode = () => {
      const isDark = htmlElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Optionally, observe for changes if the theme might toggle dynamically
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark", // Use 'light' for light mode
      background: {
        default: "#111c44", // Background for dark mode
      },
      text: {
        primary: "#ffffff", // White text for dark mode
      },
    },
  });

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

      // Add the initial response message to statusMessages
      setStatusMessages((prev) => [...prev, response?.data?.message]);

      // Initialize the socket connection
      const socket = io(
        `${process.env.REACT_APP_API_URL}/processing-${classId}`
      );

      // Handle status messages from the server
      socket.on("status", (message) => {
        if (typeof message === "string") {
          // If the message is a string, add it to statusMessages
          setStatusMessages((prev) => [...prev, message]);
        } else if (typeof message === "object" && message.status) {
          // If the message is an object, format and add it to statusMessages
          const { status, pdfFile, totalPages } = message;
          const formattedMessage = `${status}: ${pdfFile} with ${totalPages} pages`;
          setStatusMessages((prev) => [...prev, formattedMessage]);

          // Update pdfProcessingDetails for tracking
          setPdfProcessingDetails((prev) => ({
            ...prev,
            [pdfFile?.trim()]: {
              status: status,
              pages: totalPages,
            },
          }));
        }
      });

      // Handle error messages from the server
      socket.on("error", (errorMessage) => {
        setStatusMessages((prev) => [...prev, `Error: ${errorMessage}`]);
        setIsLoading(false);
      });

      // Handle socket disconnection
      socket.on("disconnect", () => {
        setIsLoading(false);
      });
    } catch (error) {
      setStatusMessages((prev) => [...prev, "Failed to start processing."]);
      setIsLoading(false);
    }
  };

  const handlePdfImages = (pdfName) => {
    if (!pdfName) return toast.error("No pdf name found");
    if (!classId) return toast.error("No class id found");

    setPdfName(pdfName);
    SetShowProcessingImageModal(true);
    SetShowProcessingModal(false);
  };

  // Table columns configuration
  const columns = [
    { field: "pdfName", headerName: "PDF Name", width: 250 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <span
          style={{
            color:
              params.value === "Rejected"
                ? "red"
                : params.value === "Processed"
                ? "green"
                : "inherit",
          }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "pages", headerName: "Pages", width: 110 },
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
            {/* <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              components={{
                Toolbar: GridToolbar, // Optional: add toolbar
              }}
              slots={{ toolbar: GridToolbar }}
            /> */}
            {isDarkMode ? (
              <ThemeProvider theme={darkTheme}>
                <DataGrid
                  className="dark:bg-navy-700"
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  components={{
                    Toolbar: GridToolbar, // Optional: add toolbar
                  }}
                  slots={{ toolbar: GridToolbar }}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      fontWeight: 900,
                      fontSize: "1rem",
                      backgroundColor: "rgba(255, 255, 255, 0.1)", // Header background for dark mode
                      color: "#ffffff", // Force header text to white
                    },
                    "& .MuiDataGrid-cell": {
                      fontSize: "0.80rem",
                      color: "#ffffff", // Force cell text to white
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)", // Hover effect for dark mode
                    },
                    "& .MuiTablePagination-root": {
                      color: "#ffffff", // Pagination text color
                    },
                    "& .MuiDataGrid-footerContainer": {
                      backgroundColor: "#111c44", // Footer background for dark mode
                      color: "#ffffff", // Footer text color
                    },
                    "& .MuiDataGrid-toolbarContainer button": {
                      color: "#ffffff", // Toolbar button color
                    },
                    "& .MuiDataGrid-toolbarContainer svg": {
                      fill: "#ffffff", // Toolbar icon color
                    },
                  }}
                />
              </ThemeProvider>
            ) : (
              <div
                style={{ height: "400px", width: "100%" }}
                className="dark:bg-navy-700"
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  components={{
                    Toolbar: GridToolbar, // Optional: add toolbar
                  }}
                  slots={{ toolbar: GridToolbar }}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      fontWeight: 900,
                      fontSize: "1rem",
                      backgroundColor: "#ffffff",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                    },
                    "& .MuiTablePagination-root": {
                      color: "#000000", // Text color for pagination controls
                    },
                    "& .MuiDataGrid-cell": {
                      fontSize: "0.80rem", // Smaller row text
                      color: "#000000", // Cell text color in dark mode
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional hover effect in dark mode
                    },
                  }}
                />
              </div>
            )}
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
