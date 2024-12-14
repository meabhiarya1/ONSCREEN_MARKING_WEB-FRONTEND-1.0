import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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

  const navigate = useNavigate();

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

  //   console.log(savedQuestionData);

  const handleSelectCoordinates = async (folder, _, level) => {
    if (folder.originalId) {
      navigate(`/admin/coordinates/${folder.originalId}`);
    } else {
      toast.error("No coordinates selected");
      return;
    }
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
      console.log(response?.data?.data);
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
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

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

    return (
      <div
        className={`${folderStyle} p-4 ${color} rounded shadow`}
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
        <div className="w-full flex-col gap-2">
          <div className="flex items-center gap-4">
            <span
              className="text-black-500 cursor-pointer font-semibold"
              onClick={() => handleFolderClick(folder.id)}
            >
              📁 {folder?.name}
            </span>

            {/* {console.log("currentQuestion", currentQuestion)} */}

            <span className="border  px-2 py-1 text-sm font-medium ">
              Max Marks :{" "}
              {currentQ?.length > 0 || currentQ !== undefined
                ? parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.maxMarks
                  : "0"
                : "0"}
            </span>

            <span className="border  px-2 py-1 text-sm font-medium ">
              Min Marks :{" "}
              {currentQ?.length > 0 || currentQ !== undefined
                ? parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.minMarks
                  : "0"
                : "0"}
            </span>

            <span className="border  px-2 py-1 text-sm font-medium ">
              Bonus Marks :{" "}
              {currentQ?.length > 0 || currentQ !== undefined
                ? parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.bonusMarks
                  : "0"
                : "0"}
            </span>

            <span className="border  px-2 py-1 text-sm font-medium ">
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

            <label className="text-sm font-medium text-gray-700">
              Sub Questions
            </label>

            <button
              className="font-md rounded-lg border-2 border-gray-900 bg-blue-800 px-3 py-1.5 text-white"
              disabled={isSaving}
              onClick={() => handleSelectCoordinates(folder)}
            >
              Select Coordinates
            </button>
          </div>

          {/* Sub Questions Input Fields */}
          {folder.showInputs && (
            <div className="ml-12 mt-4 flex items-center gap-4">
              <label className="ml-2 text-sm text-gray-700">
                No. of Sub-Questions:
              </label>
              <span className="border  px-2 py-1 text-sm font-medium ">
                {currentQ?.length > 0 || currentQ !== undefined
                  ? parseInt(currentQ[0]?.questionsName) === folderId
                    ? currentQ[0]?.numberOfSubQuestions
                    : "0"
                  : "0"}
              </span>
              <label className="ml-2 text-sm text-gray-700">
                No. of compulsory Sub-Questions
              </label>
              <span className="border  px-2 py-1 text-sm font-medium ">
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
    <div className="custom-scrollbar min-h-screen bg-gray-100 p-6">
      <div className="max-h-[75vh] min-w-[1000px] space-y-4 overflow-x-auto overflow-y-scroll rounded-lg border border-gray-300 p-4">
        {folders.map((folder) => renderFolder(folder))}
      </div>
    </div>
  );
};

export default SelectCoordinates;
