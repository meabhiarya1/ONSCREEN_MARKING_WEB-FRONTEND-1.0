import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { FcProcess } from "react-icons/fc";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MdTask } from "react-icons/md";
import AssignBookletModal from "../../../components/modal/AssignBookletModal";
import axios from "axios";

// Initialize socket connection
const socket = io(process.env.REACT_APP_API_URL, {
  transports: ["websocket"], // Force WebSocket only for stability
  reconnectionAttempts: 5,
  timeout: 20000,
});

const Booklets = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAssignBookletModal, setShowAssignBookletModal] = useState(false);
  const [currentBookletDetails, setCurrentBookletDetails] = useState("");
  const [assignTask, setAssignTask] = useState("");

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

  useEffect(() => {
    const fetchTasksBySubjectCode = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/tasks/subjectcode`,
          {
            params: { subjectcode: currentBookletDetails?.folderName },
          }
        );
        // console.log(response.data); // Handle the response data
        setAssignTask(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error); // Handle errors
      }
    };

    // Usage
    fetchTasksBySubjectCode();
  }, []);

  console.log(assignTask)

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

  const columns = [
    { field: "folderName", headerName: "Course Code", width: 120 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "scannedFolder", headerName: "Scanned Data", width: 150 },
    { field: "unAllocated", headerName: "Unallocated", width: 150 },
    { field: "allocated", headerName: "Allocated", width: 110 },
    { field: "evaluated", headerName: "Evaluated", width: 150 },
    {
      field: "evaluation_pending",
      headerName: "Evaluation Pending",
      width: 150,
    },

    {
      field: "processBooklets",
      headerName: "Process Booklets",
      width: 150,
      renderCell: (params) => (
        <div
          className="flex cursor-pointer justify-center rounded px-3 py-2 text-center font-medium text-yellow-600 "
          onClick={() => {
            localStorage.removeItem("navigateFrom");
            navigate(`/admin/process/booklets/${params.row.folderName}`);
          }}
        >
          <FcProcess className="size-7 text-indigo-500 " />
        </div>
      ),
    },
    {
      field: "assignTask",
      headerName: "Assign Task",
      width: 150,
      renderCell: (params) => (
        <div
          className="flex cursor-pointer justify-center rounded px-3 py-2 text-center font-medium text-yellow-600  "
          onClick={() => {
            setShowAssignBookletModal(true);
            setCurrentBookletDetails(params.row);
          }}
        >
          <MdTask className="size-7 text-yellow-600 " />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const handleFolderList = (folderList) => {
      // console.log("Initial folder list:", folderList);
      setRows(folderList.map((folder) => ({ ...folder, id: folder._id })));
    };

    const handleFolderUpdate = (updatedFolder) => {
      // console.log("Folder updated:", updatedFolder);
      setRows((prevFolders) =>
        prevFolders.map((folder) =>
          folder._id === updatedFolder._id
            ? { ...updatedFolder, id: updatedFolder._id }
            : folder
        )
      );
    };

    const handleFolderAdd = (newFolder) => {
      // console.log("New folder added:", newFolder);
      setRows((prevFolders) => [
        ...prevFolders,
        { ...newFolder, id: newFolder._id },
      ]);
    };

    const handleFolderRemove = ({ folderName }) => {
      console.log("Folder removed:", folderName);
      setRows((prevFolders) =>
        prevFolders.filter((folder) => folder.folderName !== folderName)
      );
    };

    // Connect socket and fetch data immediately
    socket.connect();
    socket.emit("request-folder-list"); // Request data immediately after mounting

    // Attach event listeners for real-time updates
    socket.on("folder-list", handleFolderList);
    socket.on("folder-update", handleFolderUpdate);
    socket.on("folder-add", handleFolderAdd);
    socket.on("folder-remove", handleFolderRemove);

    return () => {
      // Disconnect the socket and cleanup listeners
      socket.off("folder-list", handleFolderList);
      socket.off("folder-update", handleFolderUpdate);
      socket.off("folder-add", handleFolderAdd);
      socket.off("folder-remove", handleFolderRemove);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="mt-12">
      {isDarkMode ? (
        <ThemeProvider theme={darkTheme}>
          <div style={{ maxHeight: "500px", width: "100%", overflow: "auto" }}>
            <DataGrid
              className="dark:bg-navy-700"
              rows={rows}
              columns={columns}
              style={{ width: "100%" }}
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
          </div>
        </ThemeProvider>
      ) : (
        <div
          style={{ maxHeight: "600px", width: "100%", overflow: "auto" }}
          className="dark:bg-navy-700"
        >
          <DataGrid
            rows={rows}
            columns={columns}
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
                color: "#000000", // Cell text color
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)", // Optional hover effect
              },
            }}
          />
          {showAssignBookletModal && (
            <AssignBookletModal
              setShowAssignBookletModal={setShowAssignBookletModal}
              currentBookletDetails={currentBookletDetails}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Booklets;
