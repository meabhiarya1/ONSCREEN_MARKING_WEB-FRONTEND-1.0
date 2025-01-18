import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { FcProcess } from "react-icons/fc";

// Initialize socket connection
const socket = io(process.env.REACT_APP_API_URL, {
  transports: ["websocket"], // Force WebSocket only for stability
  reconnectionAttempts: 5,
  timeout: 20000,
});

const Booklets = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "folderName", headerName: "Course Code", width: 120 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "allocated", headerName: "Allocated", width: 110 },
    { field: "unAllocated", headerName: "Unallocated", width: 150 },
    { field: "evaluated", headerName: "Evaluated", width: 150 },
    {
      field: "evaluation_pending",
      headerName: "Evaluation Pending",
      width: 150,
    },
    { field: "totalAllocations", headerName: "Total Allocations", width: 150 },
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
          <FcProcess className="size-6 text-indigo-500 " />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const handleFolderList = (folderList) => {
      console.log("Initial folder list:", folderList);
      setRows(folderList.map((folder) => ({ ...folder, id: folder._id })));
    };

    const handleFolderUpdate = (updatedFolder) => {
      console.log("Folder updated:", updatedFolder);
      setRows((prevFolders) =>
        prevFolders.map((folder) =>
          folder._id === updatedFolder._id
            ? { ...updatedFolder, id: updatedFolder._id }
            : folder
        )
      );
    };

    const handleFolderAdd = (newFolder) => {
      console.log("New folder added:", newFolder);
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
      <div style={{ maxHeight: "600px", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          sx={{
            "& .custom-header": {
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: "bold",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Booklets;
