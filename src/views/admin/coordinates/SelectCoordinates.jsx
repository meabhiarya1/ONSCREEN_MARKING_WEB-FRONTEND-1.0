import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ImageModal from "components/modal/ImageModal";
import ViewImageModel from "components/modal/ViewImageModel";

const SelectCoordinates = () => {
  const [schemaData, setSchemaData] = useState(null);
  const [savedQuestionData, setSavedQuestionData] = useState([]);
  const [folders, setFolders] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const countRef = useRef(); // Ref for number of sub-questions
  const formRefs = useRef({}); // Ref object to hold form input values for each folder
  const [isSubQuestion, setIsSubQuestion] = useState(false); // Track if it's a sub-question
  const [questionData, setQuestionData] = useState({}); // Store question data
  const [savingStatus, setSavingStatus] = useState({}); // Track saving per folder
  const [parentId, setParentId] = useState([]); // Track parent folder
  const [currentQuestionNo, setCurrentQuesNo] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [subQuestionsFirst, setSubQuestionsFirst] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showViewImageModal, setShowViewImageModal] = useState(false);
  const [folderIdQuestion, setFolderIdQuestion] = useState(undefined);
  const [questionId, setQuestionId] = useState("");
  const [questionDone, setQuestionDone] = useState([]);
  const [filterOutQuestionDone, setFilterOutQuestionDone] = useState([]);
  const [formData, setFormData] = useState({
    courseSchemaRelationId: "",
    questionId: "",
    questionImages: [],
    answerImages: [],
  });
  const [showAnswerModel, setShowAnswerModel] = useState(false);
  const [getSubjectbyIdData, setGetsubjectbyIdData] = useState([]);
  const [folderid, setFolderId] = useState();

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/relations/getsubjectbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGetsubjectbyIdData(response.data);
        const schemaId = response?.data?.schemaId;

        if (schemaId) {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/schemas/get/schema/${schemaId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const schemaData = response?.data || []; // Fallback to an empty array if no data
            setSchemaData(schemaData);
            setFolders(
              generateFolders(
                schemaData.totalQuestions,
                savedQuestionData[0]?._id
              )
            );

            const responseData = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/schemas/getall/questiondefinitions/${schemaId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setSavedQuestionData(responseData?.data?.data || []);
          } catch (error) {
            console.error("Error fetching schema data:", error);
            toast.error(error.response.data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching schema data:", error);
      }
    };
    fetchedData();
  }, [id, token]);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/coordinates/getcoordinateallocationbyschemarelationid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuestionDone(response?.data);
      } catch (error) {
        console.log(error);
        // toast.error(error?.response?.data?.message);
      }
    };
    fetchedData();
  }, [id, token]);

  useEffect(() => {
    setFilterOutQuestionDone(
      savedQuestionData.filter((savedItem) =>
        questionDone.some((doneItem) => savedItem._id === doneItem.questionId)
      )
    );
  }, [savedQuestionData, questionDone]);

  const navigate = useNavigate();

  const handleSubmitButton = async () => {
    if (
      formData.questionImages.length === 0 ||
      formData.answerImages.length === 0
    ) {
      toast.error("Please select at least one image");
      return;
    }

    // Optimistic update
    setQuestionDone((prev) => [
      ...prev,
      { questionId: formData.questionId, temporary: true },
    ]);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/coordinates/createcoordinateallocation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Replace the optimistic update with real data
      setQuestionDone((prev) =>
        prev.map((item) =>
          item.questionId === formData.questionId
            ? { questionId: formData.questionId, ...response.data }
            : item
        )
      );

      setShowAnswerModel(false);
      setShowImageModal(false);
      setFormData({
        courseSchemaRelationId: "",
        questionId: "",
        questionImages: [],
        answerImages: [],
      });
      toast.success("Coordinates added successfully");
    } catch (error) {
      // Rollback optimistic update if there's an error
      setQuestionDone((prev) =>
        prev.filter((item) => item.questionId !== formData.questionId)
      );

      // console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateButton = async (questionIdtoUpdate) => {
    const primaryQuestionToUpdate = questionDone.filter(
      (item) => item.questionId === questionIdtoUpdate
    );
    if (
      formData.questionImages.length === 0 ||
      formData.answerImages.length === 0
    ) {
      toast.error("Please select at least one image");
      return;
    }

    // Optimistic update
    setQuestionDone((prev) => [
      ...prev,
      { questionId: formData.questionId, temporary: true },
    ]);

    const updatedData = {
      answerImages: formData.answerImages,
      questionImages: formData.questionImages,
    };
    // console.log(updatedData)
    // return

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/coordinates/updatecoordinateallocation/${primaryQuestionToUpdate[0]._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Replace the optimistic update with real data
      setQuestionDone((prev) =>
        prev.map((item) =>
          item.questionId === formData.questionId
            ? { questionId: formData.questionId, ...response.data }
            : item
        )
      );

      setShowAnswerModel(false);
      setShowImageModal(false);
      toast.success("Coordinates added successfully");
    } catch (error) {
      // Rollback optimistic update if there's an error
      setQuestionDone((prev) =>
        prev.filter((item) => item.questionId !== formData.questionId)
      );

      // console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const generateFolders = (count) => {
    const folders = [];
    for (let i = 1; i <= count; i++) {
      folders.push({
        id: i,
        name: `Q. ${i}`,
        children: [],
        showInputs: false,
        isSubQuestion: false,
      });
    }
    return folders;
  };

  const toggleInputsVisibility = (folderId) => {
    // console.log(folderId);
    const updateFolders = (folders) =>
      folders.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            showInputs: !folder.showInputs,
            isSubQuestion: !folder.isSubQuestion, // Toggle isSubQuestion
          };
        }
        if (folder.children.length > 0) {
          return { ...folder, children: updateFolders(folder.children) };
        }
        return folder;
      });

    setFolders((prevFolders) => updateFolders(prevFolders));
  };

  // const handleSelectCoordinates = async (folder, _, level) => {
  //   // if (folder.originalId) {
  //   //   navigate(`/admin/coordinates/${folder.originalId}`);
  //   // } else {
  //   //   toast.error("No coordinates selected");
  //   //   return;
  //   // }
  //   setShowImageModal(!showImageModal);
  //   setQuestionId(
  //     savedQuestionData.filter(
  //       (savedQuestion) =>
  //         parseInt(savedQuestion.questionsName) === folder.id || undefined
  //     )
  //   );
  // };

  const handleSelectCoordinates = async (folder) => {
    setFolderIdQuestion(folder.id); // Set the folder ID
    setShowImageModal(true); // Show the modal
    setQuestionId(
      savedQuestionData.filter(
        (savedQuestion) =>
          parseInt(savedQuestion.questionsName) === folder.id || undefined
      )
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      questionImages: [],
      answerImages: [],
    }));
  };

  const handleAllSelectedImage = (folder) => {
    setFolderIdQuestion(folder.id); // Set the folder ID
    setFolderId(folder.id);
    setShowViewImageModal(true); // Show the modal
    setQuestionId(
      savedQuestionData.filter(
        (savedQuestion) =>
          parseInt(savedQuestion.questionsName) === folder.id || undefined
      )
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      questionImages: [],
      answerImages: [],
    }));
  };

  const handleFolderClick = async (folderId) => {
    const currentQuestionInfo =
      savedQuestionData &&
      savedQuestionData.length > 0 &&
      savedQuestionData.filter((item) =>
        item.questionsName.startsWith(folderId)
      );

    // console.log(currentQuestionInfo);

    if (!currentQuestionInfo[0]?._id || currentQuestionInfo.length === 0) {
      toast.warning("No sub-questions");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/schemas/get/questiondefinition/${currentQuestionInfo[0]?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response?.data?.data);
      toggleInputsVisibility(folderId);
      const subQuestionsNumber =
        response?.data?.data?.parentQuestion.numberOfSubQuestions || [];

      setSubQuestionsFirst(response?.data?.data?.subQuestions || []);

      const updateFolders = (folders) =>
        folders.map((folder) => {
          if (folder.id === folderId) {
            const isCollapsed = folder.isCollapsed || false;

            // Ensure subQuestions is a number and generate an array based on its value
            const validSubQuestionsCount =
              typeof subQuestionsNumber === "number" ? subQuestionsNumber : 0;

            return {
              ...folder,
              children: isCollapsed
                ? [] // Collapse the folder by clearing children
                : Array.from({ length: validSubQuestionsCount }, (_, i) => ({
                    id: `${folderId}-${i + 1}`,
                    name: `Q. ${folderId}.${i + 1}`, // You can format this as needed
                    children: [],
                    showInputs: false,
                  })),
              isCollapsed: !isCollapsed, // Toggle collapsed state
              showInputs: !folder.showInputs, // Toggle input visibility
              isSubQuestion: !folder.isSubQuestion, // Toggle isSubQuestion
            };
          }

          if (folder.children && folder.children.length > 0) {
            return { ...folder, children: updateFolders(folder.children) };
          }

          return folder;
        });

      toggleInputsVisibility(folderId);
      setFolders((prevFolders) => updateFolders(prevFolders));
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // console.log(getSubjectbyIdData);

  const handleFinalSubmitButton = async () => {
    if (filterOutQuestionDone.length != folders.length) {
      toast.error("Please select all questions images & answers images");
      return;
    }
    try {
      const updatedData = new FormData();

      updatedData.append("schemaId", getSubjectbyIdData?.schemaId);
      updatedData.append("subjectId", getSubjectbyIdData?.subjectId);
      updatedData.append("relationName", getSubjectbyIdData?.relationName);
      updatedData.append("coordinateStatus", true);
      updatedData.append("questionPdf", getSubjectbyIdData?.questionPdfPath);
      updatedData.append("answerImages", getSubjectbyIdData?.answerPdfPath);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/subjects/relations/updatesubjectbyid/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Saved successfully");
      navigate("/admin/courses");
      // console.log(response?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  // console.log(formData);

  const renderFolder = (folder, level = 0, isLastChild = false) => {
    const folderId = folder.id;
    const isSaving = savingStatus[folderId] || false; // Check saving status for this folder
    const folderStyle = `relative ml-${level * 4} mt-3`;
    const color = level % 2 === 0 ? "bg-[#f4f4f4]" : "bg-[#fafafa]";

    let currentQ = [];

    currentQ =
      savedQuestionData &&
      savedQuestionData?.filter(
        (item) => parseInt(item.questionsName) === folderId
      );

    folder.originalId = currentQ[0]?._id;

    const isAvailable = filterOutQuestionDone.find(
      (item) => parseInt(item.questionsName) === folderId
    );

    // console.log(filterOutQuestionDone.length,folders.length);

    return (
      <div
        className={`${folderStyle} p-4 ${color} rounded text-gray-700 shadow dark:bg-navy-900 dark:text-white`}
        key={folder.id}
      >
        {level > 0 && (
          <div
            className={`absolute left-[-16px] top-[-16px] ${
              isLastChild ? "h-1/2" : "h-full"
            } w-[2px] rounded-[12px] border-l-2 border-[#8a8a8a] bg-gradient-to-b from-gray-400 to-gray-500`}
          ></div>
        )}
        {level > 0 && (
          <div className="absolute left-[-16px] top-[16px] h-[2px] w-4 rounded-md bg-gradient-to-r from-gray-400 to-gray-500"></div>
        )}
        <div className="w-full flex-col gap-4">
          <div className="flex items-center gap-1 3xl:gap-4">
            <span
              className="text-black-500 w-20 cursor-pointer font-semibold"
              onClick={() => handleFolderClick(folder.id)}
            >
              {isAvailable ? "☑️" : "📁"}
              {folder?.name}
            </span>

            {/* {console.log("currentQuestion", currentQuestion)} */}

            <span className="relative w-32 cursor-pointer rounded-md border bg-white px-2 py-1 text-center text-sm font-medium shadow-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg dark:bg-navy-700 dark:text-white">
              Max Marks :{" "}
              {currentQ?.length > 0 || currentQ !== undefined
                ? parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.maxMarks
                  : "0"
                : "0"}
            </span>

            <span className="lg relative w-32 cursor-pointer rounded-md border bg-white px-2 py-1 text-center text-sm font-medium shadow-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg dark:bg-navy-700 dark:text-white">
              Min Marks :{" "}
              {currentQ?.length > 0 || currentQ !== undefined
                ? parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.minMarks
                  : "0"
                : "0"}
            </span>

            <span className="lg relative w-32 cursor-pointer rounded-md border bg-white px-2 py-1 text-center text-sm font-medium shadow-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg dark:bg-navy-700 dark:text-white">
              Bonus Marks :{" "}
              {currentQ?.length > 0 || currentQ !== undefined
                ? parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.bonusMarks
                  : "0"
                : "0"}
            </span>

            <span className="lg relative w-44 cursor-pointer rounded-md border bg-white px-2 py-1 text-center text-sm font-medium shadow-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg dark:bg-navy-700 dark:text-white">
              Marks Difference :{" "}
              {currentQ?.length > 0 || currentQ !== undefined
                ? parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.marksDifference
                  : "0"
                : "0"}
            </span>

            <input
              type="checkbox"
              className="ml-2 cursor-pointer"
              disabled={true}
              checked={
                (currentQ?.length > 0 || currentQ !== undefined) &&
                parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.isSubQuestion
                  : false
              }
            />

            <label
              className={`text-sm font-medium  ${"text-gray-800"} w-28 dark:bg-navy-900 dark:text-white`}
            >
              Sub Questions
            </label>

            <button
              className={`font-md w-28 rounded-lg border-2 border-gray-900 bg-blue-800 py-1.5 text-white`}
              disabled={isSaving}
              onClick={() => handleSelectCoordinates(folder)}
            >
              {isAvailable ? "Update" : "Questions"}
            </button>

            <button
              className={`font-md w-24 rounded-lg py-1.5 text-white ${!isAvailable?"bg-green-400 cursor-not-allowed":"bg-green-600 hover:bg-green-700"}`}
              onClick={() => handleAllSelectedImage(folder)}
              disabled={!isAvailable}
            >
              View
            </button>
          </div>

          {/* Sub Questions Input Fields */}
          {folder.showInputs && (
            <div className="ml-12 mt-4 flex items-center gap-4">
              <label className={`ml-2 text-sm font-bold  ${"text-gray-700"} dark:text-white `}>
                No. of Sub-Questions:
              </label>
              <span
                className={`px-2 py-1 text-sm font-bold ${"text-gray-700"} dark:text-white`}
              >
                {currentQ?.length > 0 || currentQ !== undefined
                  ? parseInt(currentQ[0]?.questionsName) === folderId
                    ? currentQ[0]?.numberOfSubQuestions
                    : "0"
                  : "0"}
              </span>
              <label className={`ml-2 text-sm font-bold ${"text-gray-700"} dark:text-white`}>
                No. of compulsory Sub-Questions:
              </label>
              <span
                className={`px-2 py-1 text-sm font-bold ${"  text-gray-700"} dark:text-white`}
              >
                {currentQ?.length > 0 || currentQ !== undefined
                  ? parseInt(currentQ[0]?.questionsName) === folderId
                    ? currentQ[0]?.compulsorySubQuestions
                    : "0"
                  : "0"}
              </span>
            </div>
          )}
        </div>

        {/* Render children (sub-questions) recursively */}
        {folder.children?.map((child, index) =>
          renderFolder(child, level + 1, index === folder?.children?.length - 1)
        )}
      </div>
    );
  };

  return (
    <>
      <div className="max-h-[75vh] min-w-[1000px] space-y-4 overflow-x-auto overflow-y-scroll rounded-lg border border-gray-300 p-4 dark:border-gray-700 dark:bg-navy-700">
        {" "}
        <div className="flex justify-end">
          <span
            className="border-current group flex w-[150px] cursor-pointer items-center justify-end gap-4 rounded-lg border bg-indigo-500 px-5 py-2 text-white transition-colors hover:bg-indigo-600 focus:outline-none focus:ring active:bg-indigo-500 dark:border-gray-700"
            onClick={handleFinalSubmitButton}
          >
            <span
              className="font-medium transition-colors group-hover:text-white dark:text-white"
            >
              {" "}
              Submit{" "}
            </span>

            <span className="shrink-0 rounded-full border border-indigo-600 bg-navy-700 p-2 group-active:border-indigo-500">
              <svg
                className="size-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </span>
        </div>
        {folders.map((folder) => renderFolder(folder))}
      </div>

      {showImageModal && (
        <ImageModal
          showImageModal={showImageModal}
          setShowImageModal={setShowImageModal}
          questionId={questionId[0]?._id}
          handleSubmitButton={handleSubmitButton}
          setFormData={setFormData}
          showAnswerModel={showAnswerModel}
          setShowAnswerModel={setShowAnswerModel}
          handleUpdateButton={handleUpdateButton}
          isAvailable={filterOutQuestionDone.some(
            (item) => parseInt(item.questionsName) === folderIdQuestion // Calculate based on folderId
          )}
          questionDone={questionDone}
          formData={formData}
        />
      )}

      {showViewImageModal && (
        <ViewImageModel
        showViewImageModal={showViewImageModal}
        setShowViewImageModal={setShowViewImageModal}
        questionId={questionId[0]?._id}
        handleSubmitButton={handleSubmitButton}
        setFormData={setFormData}
        showAnswerModel={showAnswerModel}
        setShowAnswerModel={setShowAnswerModel}
        handleUpdateButton={handleUpdateButton}
        isAvailable={filterOutQuestionDone.some(
          (item) => parseInt(item.questionsName) === folderIdQuestion // Calculate based on folderId
        )}
        questionDone={questionDone}
        formData={formData}
        folderid={folderid}
        />
      )}
    </>
  );
};

export default SelectCoordinates;
