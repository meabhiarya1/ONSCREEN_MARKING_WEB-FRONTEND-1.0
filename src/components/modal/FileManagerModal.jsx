import React, { useState, useRef } from "react";
import {
  FileManagerComponent,
  Inject,
  NavigationPane,
  Toolbar,
  DetailsView,
} from "@syncfusion/ej2-react-filemanager";
// import axios from "axios";
// import { FileOpenEventArgs } from "@syncfusion/ej2-filemanager";

const FileManagerModal = ({
  setShowFileManager,
  selectedPath,
  setSelectedPath,
}) => {
  const [errorMessage, setErrorMessage] = useState(null); // State to store error message
  const fileManagerRef = useRef(null); // Reference to FileManagerComponent

  const handleFileSelect = (args) => {
    if (args.fileDetails.isFile === false) {
      const path = args.fileDetails.filterPath;
      const mainPath = "scannedData" + path + args.fileDetails.name;
      setSelectedPath(mainPath);
    }
  };

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
          {" "}
          <div id="file-manager-container">
            <FileManagerComponent
              id="file_manager"
              ref={fileManagerRef}
              ajaxSettings={{
                url: `${process.env.REACT_APP_API_URL}/api/syncfusion`,
                // createUrl: `http://192.168.1.43:8090/api/filemanager/create`,
                // uploadUrl: `http://192.168.1.43:8090/api/filemanager/upload`,
                // downloadUrl: `http://192.168.1.43:8090/api/filemanager/download`,
                // deleteUrl: `http://192.168.1.43:8090/api/filemanager/delete`,
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
              enablePersistence={true}
              allowDragAndDrop={false}
              showFileExtension={true}
              showThumbnail={true}
              view="LargeIcons"
              fileSelect={handleFileSelect}
            >
              {" "}
              <Inject services={[NavigationPane, Toolbar, DetailsView]} />
            </FileManagerComponent>

            {/* Display error message */}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>{" "}
          <div className="flex items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex">
              <p className="text-md flex items-center justify-center font-bold text-gray-700">
                Selected Path:
              </p>
              <div className="text-md px-2 font-medium text-gray-800">
                {selectedPath}
              </div>
            </div>

            {/* Right Side */}
            <button
              className="my-2 flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white"
              onClick={() => setShowFileManager(false)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagerModal;
