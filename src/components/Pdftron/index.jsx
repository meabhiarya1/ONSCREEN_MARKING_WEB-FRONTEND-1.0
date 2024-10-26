import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import { useSelector } from "react-redux";

const MyComponent = () => {
  const viewer = useRef(null);
  const pageIndex = useSelector((state) => state.evaluator.currentIndex); // Get the current page index from Redux
  console.log("Current Page Index: ", pageIndex);

  useEffect(() => {
    const initializeViewer = async () => {
      const instance = await WebViewer.WebComponent(
        {
          path: "/webviewer/lib",
          licenseKey:
            "demo:1729745081913:7e16a2040300000000f5e474a6f9002123208fabcaf1dab4014e5735fa",
          initialDoc:
            "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
        },
        viewer.current
      );

      const { documentViewer, annotationManager, Annotations } = instance.Core;
      //   documentViewer.setCurrentPage(2);
      console.log(documentViewer);
      // Add event listener for document loaded
      documentViewer.addEventListener("documentLoaded", () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 3,
          X: 100,
          Y: 150,
          Width: 200,
          Height: 50,
          Author: annotationManager.getCurrentUser(),
        });

        annotationManager.addAnnotation(rectangleAnnot);
        annotationManager.redrawAnnotation(rectangleAnnot);

        // Navigate to the specified page when the document is loaded
        // documentViewer.setCurrentPage(pageIndex);
      });

      // Set the page when the pageIndex changes
      const handlePageChange = () => {
        // Always set the current page based on the pageIndex from Redux
        documentViewer.setCurrentPage(pageIndex);
      };

      // Set the initial page
      //   handlePageChange();

      // Re-run the page change whenever pageIndex changes
      return () => {
        // No cleanup required since we're not setting up any persistent listeners
      };
    };

    initializeViewer();
  }, [pageIndex]); // Re-run effect if pageIndex changes

  return (
    <div className="h-[90vh]">
      <div className="webviewer h-full w-full" ref={viewer}></div>
    </div>
  );
};

export default MyComponent;
