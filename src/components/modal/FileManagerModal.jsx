import React from "react";
import {
  FileManagerComponent,
  Inject,
  NavigationPane,
  Toolbar,
  DetailsView,
} from "@syncfusion/ej2-react-filemanager";

const FileManagerModal = () => {
  return (
    <div>
      <div className="control-section">
        <div id="file-manager-container">
          <FileManagerComponent
            id="file_manager"
            ajaxSettings={{
              url: `${process.env.REACT_APP_API_URL}/api/filemanager/list`,
              uploadUrl: `${process.env.REACT_APP_API_URL}api/filemanager/upload`,
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
          >
            <Inject services={[NavigationPane, Toolbar, DetailsView]} />
          </FileManagerComponent>
        </div>
      </div>
    </div>
  );
};

export default FileManagerModal;
