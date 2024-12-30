import ImageContainer from "components/Imagecontainer/ImageContainer";
import { getUserDetails, getAllUsers } from "services/common";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import Dropdown from "components/dropdown";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { useStopwatch } from "react-timer-hook";
import QuestionSection from "components/QuestionSection/QuestionSection";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice";
import avatar from "assets/img/avatars/avatar4.png";
import {
  setIndex,
  setBaseImageUrl,
  setCurrentTaskDetails,
} from "store/evaluatorSlice";
import { getAllEvaluatorTasks } from "components/Helper/Evaluator/EvalRoute";
import { getTaskById } from "components/Helper/Evaluator/EvalRoute";
import { useParams } from "react-router-dom";
import { getAnswerPdfById } from "components/Helper/Evaluator/EvalRoute";
import { updateAnswerPdfById } from "components/Helper/Evaluator/EvalRoute";
import { getQuestionSchemaById } from "components/Helper/Evaluator/EvalRoute";
import { setCurrentBookletIndex } from "store/evaluatorSlice";
const CheckModule = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answerSheetCount, setAnswerSheetCount] = useState(null);
  const [answerImageDetails, setAnswerImageDetails] = useState([]);
  // const [taskDetails, setTaskDetails] = useState(null);
  const evaluatorState = useSelector((state) => state.evaluator);
  const taskDetails = evaluatorState?.currentTaskDetails;
  const currentBookletIndex = evaluatorState.currentBookletIndex;
  const svgFiles = [
    "/pageicons/red.svg",
    "/pageicons/green.svg",
    "/pageicons/yellow.svg",
  ];
  const { id } = useParams();
  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        setLoading(true);
        const response = await getTaskById(id);
        const {
          answerPdfDetails,
          answerPdfImages,
          extractedImagesFolder,
          // questionDefinitions,
          task,
        } = response;
      

        dispatch(setCurrentTaskDetails(task));
        dispatch(setCurrentBookletIndex(task.currentFileIndex));
        dispatch(setBaseImageUrl(extractedImagesFolder));
        setAnswerSheetCount(answerPdfDetails);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getTaskDetails();
  }, [currentBookletIndex]);

  useEffect(() => {
    const getEvaluatorTasks = async (taskId) => {
      try {
        console.log(taskId);
        const res = await getAnswerPdfById(taskId);
        setAnswerImageDetails(res);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (answerSheetCount) {
      // console.log(answerSheetCount)
      getEvaluatorTasks(answerSheetCount._id);
    }
  }, [evaluatorState.currentIndex, answerSheetCount]);

  const Imgicons = answerImageDetails.map((item, index) => {
    const svgIcon =
      item.status === "notVisited" ? 2 : item.status === "submitted" ? 1 : 0;
    const active =
      index + 1 === evaluatorState.currentIndex
        ? "bg-gray-600 text-white border rounded"
        : "";
    return (
      <div
        key={index}
        className={`my-1 cursor-pointer rounded py-2 text-center hover:bg-gray-300 active:bg-gray-400  ${active}`}
        onClick={() => {
          handleUpdateImageDetail(item, index);
        }}
      >
        <img
          src={svgFiles[svgIcon]}
          width={50}
          height={50}
          alt="icon"
          className="mx-auto"
        />
        <div>{index + 1}</div>
      </div>
    );
  });
  const handleUpdateImageDetail = async (item, index) => {
    try {
      console.log("called");
      console.log(item._id);

      const response = await updateAnswerPdfById(item._id, "visited");
      dispatch(setIndex({ index: index + 1 }));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
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
  } = useStopwatch({ autoStart: false });
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

  const [darkmode, setDarkmode] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [questionModal, setShowQuestionModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const questionHandler = () => {
    console.log("question handler");
    setShowQuestionModal(true);
  };
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const fetchData = async () => {
      try {
        const response = await getUserDetails(token);
        // console.log(data)
        // const allUsers = await getAllUsers();
        setUserDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [authState.isAuthenticated, navigate]);

  const [loginHours, loginMinutes, loginSeconds] = loginTime
    ? loginTime.split(":")
    : ["--", "--", "--"];

  return (
    <>
      <div className="flex h-[10vh] w-[100vw] items-center justify-around bg-gradient-to-r from-[#33597a] to-[#33a3a3]  py-5 text-white">
        <div>
          <img src="/ios.png" alt="ios_default" />
        </div>
        <div className="flex w-[70%] items-center justify-between rounded-sm py-1 text-lg font-bold backdrop-blur-2xl">
          {/* Evaluator Section */}
          <section className="flex-1 basis-1/3 space-y-1 px-4 ">
            <div>
              <span className="font-semibold text-gray-600">Evaluator ID</span>{" "}
              : <span className="font-bold text-gray-200">46758390</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Subject</span> :{" "}
              <span className="font-bold text-gray-200">
                Engineering Mathematics - III
              </span>
            </div>
          </section>

          {/* Booklet Section */}
          <section className="flex-1 basis-1/3 space-y-1 px-4 text-center">
            <div>
              <span className="font-semibold text-gray-600">Booklet Title</span>
              :
              <span className="font-bold text-gray-200">
                {answerSheetCount?.answerPdfName || "Loading..."}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">
                Current Booklet Index
              </span>
              :
              <span className="font-bold text-gray-200">
                {taskDetails?.currentFileIndex || "N/A"}
              </span>
            </div>
          </section>

          {/* Timing Section */}
          <section className="flex-1 basis-1/3 space-y-1 px-4 text-end">
            <div>
              <span className="font-semibold text-gray-600">Login Time</span>:
              <span className="inline-block w-[100px] text-center font-mono">
                {loginTime || "Loading..."}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">
                Evaluation Time
              </span>
              :
              <span className="inline-block w-[30px] text-center font-mono">
                {hours}
              </span>
              :
              <span className="inline-block w-[30px] text-center font-mono">
                {minutes}
              </span>
              :
              <span className="inline-block w-[30px] text-center font-mono">
                {seconds}
              </span>
            </div>
          </section>
        </div>

        <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
          <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
            <p className="pl-3 pr-2 text-xl">
              <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
            </p>
            <input
              type="text"
              placeholder="Search..."
              className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
            />
          </div>

          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              if (darkmode) {
                document.body.classList.remove("dark");
                setDarkmode(false);
              } else {
                document.body.classList.add("dark");
                setDarkmode(true);
              }
            }}
          >
            {darkmode ? (
              <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
            )}
          </div>

          {/* Profile & Dropdown */}
          <Dropdown
            button={
              <img
                className="h-10 w-10 cursor-pointer rounded-full"
                src={avatar}
                alt="Elon Musk"
              />
            }
            children={
              <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none ">
                <div className="cursor-pointer p-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      👋 Hey, {userDetails?.name}
                    </p>{" "}
                  </div>
                </div>
                <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

                <div className="flex flex-col p-4">
                  <a
                    href=" "
                    className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                    onClick={() => navigate("/admin/profile")}
                  >
                    Profile
                  </a>

                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate("/auth/sign-in");
                    }}
                    className="mt-3 text-sm font-medium text-red-500 transition duration-150 ease-out hover:text-red-500 hover:ease-in"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            }
            classNames={"py-2 top-8 -left-[180px] w-max"}
          />
        </div>
      </div>

      <div className="flex h-[90vh] w-full flex-row ">
        <div className=" w-[8%] sm:w-[20%] md:w-[12%] lg:w-[8%]">
          <div className="h-[100%]  justify-center text-center  ">
            <h2 className="sticky top-0 z-10  border-b border-gray-300 bg-[#FFFFFF] px-2 py-3 font-bold shadow-md md:text-base lg:text-xl">
              Answer Sheet Count
              <span
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  marginLeft: "4px",
                }}
              >
                {answerSheetCount?.totalImages}
              </span>
            </h2>
            <div className="h-[80%] ">
              <div className="grid h-[100%]  grid-cols-2 overflow-auto bg-[#F5F5F5] md:grid-cols-2">
                {Imgicons}
              </div>
            </div>

            <button
              type="button"
              className="mb-2 me-2 w-full bg-gradient-to-r from-[#33597a] to-[#33a3a3] px-1.5 py-2.5 text-center text-sm font-medium  text-white hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-800"
              onClick={questionHandler}
            >
              Show Questions and Model Answer
            </button>
          </div>
        </div>

        <div
          id="imgcontainer"
          className="h-full flex-grow  sm:w-[60%] md:w-[65%] lg:w-[72%]"
        >
          <ImageContainer />
        </div>

        <div className=" h-full sm:w-[30%] md:w-[25%] lg:block lg:w-[20%]">
          <QuestionSection answerPdfDetails={answerSheetCount} />
        </div>
      </div>
    </>
  );
};

export default CheckModule;
