import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";

const ProcessingBookletsModal = ({ statusMessages }) => {
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

  return (
    <Draggable bounds="parent">
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
          width: "700px",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        <div className=" relative flex w-[650px] flex-col items-center justify-center rounded-2xl border  p-4 shadow-lg">
          <div className=" ">
            {/* Loading Status */}
            <div className="mt-6">
              <h2 className="mb-3 flex justify-center rounded-lg bg-gray-700 px-2 py-2 text-center text-xl font-semibold text-white ">
                Processing Status
              </h2>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "10px",
                  scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
                }}
              >
                {statusMessages?.map((msg, idx) =>
                  msg.includes("rejected") ? (
                    <p key={idx} className="text-red-600">
                      {msg}
                    </p>
                  ) : msg.includes("completed") ? (
                    <p key={idx} className="text-green-600">
                      {msg}
                    </p>
                  ) : (
                    <p key={idx} className="text-yellow-600">
                      {msg}
                    </p>
                  )
                )}

                {/* Dummy element to ensure scrolling to the bottom */}
                <div ref={messagesEndRef}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default ProcessingBookletsModal;
