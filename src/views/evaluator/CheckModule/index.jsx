import ImageContainer from "components/Imagecontainer/index";
import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { useStopwatch } from 'react-timer-hook';
const CheckModule = () => {
  const Imgicons = Array.from({ length: 10 }, (_, index) => {
    return (
      <div>
        <img
          src="https://img.icons8.com/cotton/100/overview-pages-1.png"
          width={70}
          height={70}
          alt="icon"
        />
        <div>{`0${index + 1}.jpg`}</div>
      </div>
    ); // This can be replaced with what you want to return in the map function
  });
  // State for the login time (when the tab is opened)
  const [loginTime, setLoginTime] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Timer hook for evaluation time, starting after login
  // const { seconds, minutes, hours, start } = useTimer({ expiryTimestamp: null, autoStart: true });
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });
  // Capture login time when the component mounts (tab is opened)
  useEffect(() => {
    const loginTime = new Date().toLocaleTimeString();
    setLoginTime(loginTime);

    // Simulate a "login" by setting the login status to true
    setIsLoggedIn(false);

    // Start the evaluation timer right after login
    const evaluationStartTime = new Date(); // Current time as the evaluation start
    evaluationStartTime.setSeconds(evaluationStartTime.getSeconds() + 1); // Start right away (0 delay)
    start(evaluationStartTime);

  }, [start]);
  return (
    <>
      <div className="flex h-[10vh] w-[100vw] items-center justify-around bg-gray-700 p-4 text-white">
      <div>Login Time: <span>{loginTime ? loginTime : "Loading..."}</span></div>
      <div>Evaluation Time: <span>{`${hours}:${minutes}:${seconds}`}</span></div>
      </div>
      {/* <PDFViewer pdfUrl="/PROJECT REPORT.pdf" /> */}
      <div className="flex h-[90vh] w-full flex-row overflow-auto">
        <div className="h-[100%] w-[10%] overflow-auto justify-center">
          <h1 className="sticky top-0 z-10 border-b border-gray-300 bg-white p-4 text-xl font-bold shadow-md">
            Total <span>40</span> Pages
          </h1>
          {Imgicons}
        </div>
        <div className="w-[60%]">
          <ImageContainer
            imageUrl={
              "https://res.cloudinary.com/dje269eh5/image/upload/v1722392010/omrimages/abcdvhjzvugmlqrxmofl.jpg"
            }
          />
        </div>
        <div className="w-[30%]"></div>
      </div>
    </>
  );
};

export default CheckModule;
