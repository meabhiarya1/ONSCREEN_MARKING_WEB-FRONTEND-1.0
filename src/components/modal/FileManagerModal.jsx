import React, { useState, useRef } from "react";
import {
  FileManagerComponent,
  Inject,
  NavigationPane,
  Toolbar,
  DetailsView,
} from "@syncfusion/ej2-react-filemanager";
import axios from "axios";

const FileManagerModal = ({ setShowFileManager }) => {
  const [selectedPath, setSelectedPath] = useState(["scanned"]);
  const [errorMessage, setErrorMessage] = useState(null); // State to store error message
  const fileManagerRef = useRef(null); // Reference to FileManagerComponent

  const onFolderCreate = async (newName) => {
    if (!selectedPath) {
      setErrorMessage("Please select a folder to create inside.");
      return;
    }

    try {
      // Send request to create folder
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/filemanager/create`,
        {
          name: newName,
          path: selectedPath, // Path where the folder will be created
        }
      );

      if (response.data) {
        alert("Folder created successfully");
        // Refresh the file manager after creating the folder
        if (fileManagerRef.current) {
          fileManagerRef.current.refresh(); // Refresh FileManager UI
        }
      }
    } catch (error) {
      // Display the error message from the server response
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.error || error.response.data.message
        );
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const onFileSelect = (args) => {
    console.log(args)
    if (args.action === "select") {
      if (selectedPath.includes(args.fileDetails.name)) return;
      setSelectedPath([...selectedPath, args.fileDetails.name]);
    } else if (args.action === "unselect") {
      if (selectedPath.includes(args.fileDetails.name)) {
        setSelectedPath(
          selectedPath.filter((path) => path !== args.fileDetails.name)
        );
      }
    }
  };

  console.log(selectedPath);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="z-50 w-[800px] rounded-lg bg-white p-6 shadow-lg">
        <span
          className="mb-2 flex cursor-pointer justify-end text-gray-600"
          onClick={() => setShowFileManager(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </span>

        <div className="control-section">
          <div id="file-manager-container">
            <FileManagerComponent
              id="file_manager"
              ref={fileManagerRef}
              ajaxSettings={{
                createUrl: `${process.env.REACT_APP_API_URL}/api/filemanager/create`,
                url: `${process.env.REACT_APP_API_URL}/api/filemanager/list`,
                uploadUrl: `${process.env.REACT_APP_API_URL}/api/filemanager/upload`,
                downloadUrl: `${process.env.REACT_APP_API_URL}/api/filemanager/download`,
                deleteUrl: `${process.env.REACT_APP_API_URL}/api/filemanager/delete`,
              }}
              toolbarSettings={{
                items: [
                  "NewFolder",
                  "SortBy",
                  "Cut",
                  "Copy",
                  "Paste",
                  "Delete",
                  "Refresh",
                  "Download",
                  "Rename",
                  "Selection",
                  "View",
                  "Details",
                ],
              }}
              showFileExtension={true}
              showThumbnail={true}
              view="LargeIcons"
              fileSelect={(e) => onFileSelect(e)}
            >
              <Inject services={[NavigationPane, Toolbar, DetailsView]} />
            </FileManagerComponent>

            <button onClick={() => onFolderCreate("New Folder")}>
              Create Folder
            </button>

            {/* Display error message */}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagerModal;
