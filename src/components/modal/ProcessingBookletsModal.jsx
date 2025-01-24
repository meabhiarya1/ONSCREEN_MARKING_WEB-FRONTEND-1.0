import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Rnd } from "react-rnd";

const ProcessingBookletsModal = ({
  statusMessages,
  SetShowProcessingModal,
}) => {
  const messagesEndRef = useRef(null); // Ref to track the end of the message container

  useEffect(() => {
    if (messagesEndRef.current) {
      const targetPosition = messagesEndRef.current.offsetTop;
      const container = messagesEndRef.current.parentElement;
      const startPosition = container.scrollTop;
      const distance = targetPosition - startPosition;
      const duration = 3000; // Duration of the scroll in milliseconds
      let startTime = null;

      const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

      const animateScroll = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1); // Ensure progress doesn't exceed 1
        const ease = easeInOutQuad(progress);
        container.scrollTop = startPosition + distance * ease;

        if (timeElapsed < duration) {
          window.requestAnimationFrame(animateScroll);
        }
      };

      window.requestAnimationFrame(animateScroll);
    }
  }, [statusMessages]);

  const handleCsvDownload = () => {
    // Adding a header row to the CSV file
    const header = "Processing Status";

    // Joining the header and status messages with newlines
    const csvContent =
      "data:text/csv;charset=utf-8," + [header, ...statusMessages].join("\n");

    // Encoding the CSV content for the download link
    const encodedUri = encodeURI(csvContent);

    // Creating a link element and triggering the download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "processing_status.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Closing the processing modal
    // SetShowProcessingModal(false);
  };

  return (
    // <Draggable  >
    //   <div
    //     style={{
    //       position: "absolute",
    //       top: "20%",
    //       left: "50%",
    //       transform: "translate(-50%, -50%)",
    //       zIndex: 0,
    //       width: "700px",
    //       // backgroundColor: "white",
    //       padding: "20px",
    //       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    //       borderRadius: "8px",
    //       cursor: "move",
    //     }}
    //     className="dark:bg-navy-900 bg-white"
    //   >
    //     <IoMdCloseCircleOutline
    //       onClick={() => SetShowProcessingModal(false)}
    //       className="absolute right-2 top-2 size-6 cursor-pointer dark:text-white"
    //     />
    //     <div className=" relative flex w-[650px] flex-col items-center justify-center rounded-2xl border  p-4 shadow-lg dark:bg-navy-700">
    //       <div className=" ">
    //         {/* Loading Status */}
    //         <div className="mt-6">
    //           <h2 className="mb-3 flex justify-center rounded-lg bg-gray-700 px-2 py-2 text-center text-xl font-semibold text-white dark:bg-navy-900">
    //             Processing Status
    //           </h2>
    //           <div
    //             style={{
    //               maxHeight: "300px",
    //               overflowY: "auto",
    //               padding: "10px",
    //               scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
    //             }}
    //           >
    //             {statusMessages?.map((msg, idx) => {
    //               if (typeof msg === "string") {
    //                 // Handle plain text messages
    //                 if (msg.toLowerCase().includes("rejected")) {
    //                   return (
    //                     <p key={idx} className="text-red-600">
    //                       {msg}
    //                     </p>
    //                   );
    //                 } else if (msg.toLowerCase().includes("completed")) {
    //                   return (
    //                     <p key={idx} className="text-green-600">
    //                       {msg}
    //                     </p>
    //                   );
    //                 } else {
    //                   return (
    //                     <p key={idx} className="text-yellow-600">
    //                       {msg}
    //                     </p>
    //                   );
    //                 }
    //               } else if (typeof msg === "object" && msg.status) {
    //                 // Handle formatted object messages
    //                 const { status, pdfFile, totalPages } = msg;
    //                 const statusClass =
    //                   status.toLowerCase() === "rejected"
    //                     ? "text-red-600"
    //                     : status.toLowerCase() === "completed"
    //                     ? "text-green-600"
    //                     : "text-yellow-600";

    //                 return (
    //                   <p key={idx} className={statusClass}>
    //                     {`${status}: ${pdfFile} with ${totalPages} pages`}
    //                   </p>
    //                 );
    //               }
    //               return null; // Fallback for unexpected message types
    //             })}

    //             {/* Dummy element to ensure scrolling to the bottom */}
    //             <div ref={messagesEndRef}></div>
    //           </div>
    //         </div>
    //         <button
    //           class="text-black group relative mt-4 h-12 w-56 rounded-2xl bg-white text-center text-xl font-semibold dark:bg-navy-900 dark:text-white"
    //           type="button"
    //           onClick={handleCsvDownload}
    //         >
    //           <div class="absolute left-1 top-[4px] z-10 flex h-10 w-1/4 items-center justify-center rounded-xl bg-green-400 duration-500 group-hover:w-[184px]">
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 1024 1024"
    //               height="25px"
    //               width="25px"
    //             >
    //               <path
    //                 d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
    //                 fill="#000000"
    //               ></path>
    //               <path
    //                 d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
    //                 fill="#000000"
    //               ></path>
    //             </svg>
    //           </div>
    //           <p class="translate-x-2">Export CSV</p>
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </Draggable>

    <Rnd
      default={{
        x: 700,
        y: 100,
        width: 650,
        height: 400,
      }}
      minWidth={400}
      minHeight={350}
      bounds="window"
      style={{
        // backgroundColor: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding:"20px",
      }}
      className="dark:bg-navy-800 bg-white"
    >
      <div className="relative flex flex-col w-full h-full dark:bg-navy-700 bg-white p-4 rounded-2xl">
        <IoMdCloseCircleOutline
          onClick={() => SetShowProcessingModal(false)}
          className="absolute -right-1 top-0 size-6 cursor-pointer dark:text-white"
        />
        <div className="h-2/3">
          <h2 className="mb-3 flex justify-center rounded-lg bg-gray-700 px-2 py-2 text-center text-xl font-semibold text-white dark:bg-navy-900">
            Processing Status
          </h2>
          <div
            className="h-full overflow-auto"
          >
            {statusMessages?.map((msg, idx) => {
              if (typeof msg === "string") {
                if (msg.toLowerCase().includes("rejected")) {
                  return (
                    <p key={idx} className="text-red-600">
                      {msg}
                    </p>
                  );
                } else if (msg.toLowerCase().includes("completed")) {
                  return (
                    <p key={idx} className="text-green-600">
                      {msg}
                    </p>
                  );
                } else {
                  return (
                    <p key={idx} className="text-yellow-600">
                      {msg}
                    </p>
                  );
                }
              } else if (typeof msg === "object" && msg.status) {
                const { status, pdfFile, totalPages } = msg;
                const statusClass =
                  status.toLowerCase() === "rejected"
                    ? "text-red-600"
                    : status.toLowerCase() === "completed"
                    ? "text-green-600"
                    : "text-yellow-600";

                return (
                  <p key={idx} className={statusClass}>
                    {`${status}: ${pdfFile} with ${totalPages} pages`}
                  </p>
                );
              }
              return null;
            })}
            <div ref={messagesEndRef}></div>
          </div>
          <button
            className="text-black group relative mt-4 h-12 w-56 rounded-2xl bg-white text-center text-xl font-semibold dark:bg-navy-900 dark:text-white"
            type="button"
            onClick={handleCsvDownload}
          >
            <div className="absolute left-1 top-[4px] z-10 flex h-10 w-1/4 items-center justify-center rounded-xl bg-green-400 duration-500 group-hover:w-[184px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                height="25px"
                width="25px"
              >
                <path
                  d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                  fill="#000000"
                ></path>
                <path
                  d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                  fill="#000000"
                ></path>
              </svg>
            </div>
            <p className="translate-x-2">Export CSV</p>
          </button>
        </div>
      </div>
    </Rnd>
  );
};

export default ProcessingBookletsModal;
