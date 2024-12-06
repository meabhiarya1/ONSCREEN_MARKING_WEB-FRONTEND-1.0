import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CreateSchemaStructure = () => {
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
  const [parentId, setParentId] = useState(null); // Track parent folder

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/schemas/get/schema/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response?.data;
        setSchemaData(data);
        if (data?.totalQuestions) {
          setFolders(generateFolders(data.totalQuestions));
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
          `${process.env.REACT_APP_API_URL}/api/schemas/getall/questiondefinitions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response?.data || []; // Fallback to an empty array if no data
        setSavedQuestionData(data);
        // toast.success("Question data fetched successfully");
      } catch (error) {
        console.error("Error fetching schema data:", error);
        toast.error(error.response.data.message);
        setSavedQuestionData([]); // Reset to an empty array on error
      }
    };
    fetchedData();
  }, [id, token]);

  // console.log(savedQuestionData);

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

  const handleSubQuestionsChange = async (folder) => {
    const folderId = folder.id;

    // console.log(formRefs?.current[`${folderId}-minMarks`]);

    if (savingStatus[folderId]) return;

    // const numSubQuestions = parseInt(count) || 0;

    const currentQuestion = savedQuestionData?.data.filter(
      (item) => parseInt(item.questionsName) === folderId
    );

    const minMarks =
      formRefs?.current[`${folderId}-minMarks`] || currentQuestion[0]?.minMarks;
    const maxMarks =
      formRefs?.current[`${folderId}-maxMarks`] || currentQuestion[0]?.maxMarks;
    const bonusMarks =
      formRefs?.current[`${folderId}-bonusMarks`] ||
      currentQuestion[0]?.bonusMarks;
    const marksDifference =
      formRefs.current[`${folderId}-marksDifference`] ||
      currentQuestion[0]?.marksDifference;

    // console.log(minMarks, maxMarks, bonusMarks, marksDifference);

    if (!minMarks || !maxMarks || !bonusMarks || !marksDifference) {
      toast.error("Please fill all the required fields");
      return;
    }

    let numberOfSubQuestions = "";
    let compulsorySubQuestions = "";

    if (folder.isSubQuestion) {
      //numberOfSubQuestions
      numberOfSubQuestions += formRefs?.current[
        `${folderId}-numberOfSubQuestions`
      ]
        ? formRefs?.current[`${folderId}-numberOfSubQuestions`]
        : currentQuestion?.length > 0 || currentQuestion !== undefined
        ? currentQuestion[0]?.numberOfSubQuestions
        : "";

      //compulsorySubQuestions
      compulsorySubQuestions += formRefs?.current[
        `${folderId}-compulsorySubQuestions`
      ]
        ? formRefs?.current[`${folderId}-compulsorySubQuestions`]
        : currentQuestion?.length > 0 || currentQuestion !== undefined
        ? currentQuestion[0]?.compulsorySubQuestions
        : "";

      if (!numberOfSubQuestions || !compulsorySubQuestions) {
        toast.error("Please fill all sub-question related fields");
        return;
      }
    }

    const updatedQuestionData = {
      // ...questionData,
      schemaId: id,
      questionsName: folderId,
      isSubQuestion: folder.isSubQuestion,
      minMarks,
      maxMarks,
      bonusMarks,
      marksDifference,
      numberOfSubQuestions: parseInt(numberOfSubQuestions),
      compulsorySubQuestions: parseInt(compulsorySubQuestions),
      parentQuestionId: parentId,
    };

    // console.log(updatedQuestionData);

    // setQuestionData(updatedQuestionData);
    setSavingStatus((prev) => ({ ...prev, [folderId]: true }));

    // console.log(updatedQuestionData)

    try {
      if (currentQuestion.length > 0) {
        console.log("pill");
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/schemas/update/questiondefinition/${currentQuestion[0]?._id}`,
          updatedQuestionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response?.data?.message);
      } else {
        console.log("object");
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/schemas/create/questiondefinition`,
          updatedQuestionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response?.data?.message);
      }

      // if (folder.isSubQuestion) {
      //   setParentId(response?.data?.data?._id);
      // }

      const updatedFolders = (folders) => {
        return folders.map((item) => {
          if (item.id === folderId) {
            const children = Array.from(
              { length: numberOfSubQuestions },
              (_, i) => ({
                id: `${folderId}-${i + 1}`,
                name: `Q. ${folderId}.${i + 1}`,
                children: [],
                showInputs: false,
              })
            );
            return { ...item, children };
          }
          if (item.children && item.children.length > 0) {
            return { ...item, children: updatedFolders(item.children) };
          }
          return item; // No changes for items that do not match
        });
      };

      // Update state
      setFolders((prevFolders) => updatedFolders(prevFolders));
    } catch (error) {
      console.error("Error creating questions:", error);
      toast.error("Failed to save the question data.");
    } finally {
      setSavingStatus((prev) => ({ ...prev, [folderId]: false }));
    }
  };

  const renderFolder = (folder, level = 0, isLastChild = false) => {
    const folderId = folder.id;
    const isSaving = savingStatus[folderId] || false; // Check saving status for this folder
    const folderStyle = `relative ml-${level * 4} mt-3`;
    const color = level % 2 === 0 ? "bg-[#f4f4f4]" : "bg-[#fafafa]";

    const handleMarkChange = (inputBoxName, inputValue) => {
      // console.log(inputBoxName, inputValue);
      // console.log(formRefs.current[inputBoxName]);
      formRefs.current[inputBoxName] = inputValue;
      // console.log(formRefs.current);
    };

    const currentQuestion = savedQuestionData?.data?.filter(
      (item) => parseInt(item.questionsName) === folderId
    );

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
            <span className="text-black-500 font-semibold">
              📁 {folder?.name}
            </span>

            {/* {console.log("currentQuestion", currentQuestion)} */}

            <input
              onChange={(e) => {
                handleMarkChange(`${folder.id}-minMarks`, e.target.value);
              }}
              type="text"
              placeholder="Min"
              defaultValue={
                (currentQuestion?.length > 0 || currentQuestion !== undefined) &&
                parseInt(currentQuestion[0]?.questionsName) === folderId
                  ? currentQuestion[0]?.minMarks
                  : ""
              }
              className="ml-2 w-12 rounded border px-2 py-1 text-sm"
            />

            <input
              onChange={(e) => {
                handleMarkChange(`${folder.id}-maxMarks`, e.target.value);
              }}
              type="text"
              placeholder="Max"
              className="ml-2 w-12 rounded border px-2 py-1 text-sm"
              defaultValue={
                (currentQuestion?.length > 0 || currentQuestion !== undefined) &&
                parseInt(currentQuestion[0]?.questionsName) === folderId
                  ? currentQuestion[0]?.maxMarks
                  : ""
              }
            />

            <input
              onChange={(e) => {
                handleMarkChange(`${folder.id}-bonusMarks`, e.target.value);
              }}
              type="text"
              placeholder="Bonus"
              className="ml-2 w-14 rounded border px-2 py-1 text-sm"
              defaultValue={
                (currentQuestion?.length > 0 || currentQuestion !== undefined) &&
                parseInt(currentQuestion[0]?.questionsName) === folderId
                  ? currentQuestion[0]?.bonusMarks
                  : ""
              }
            />

            <input
              onChange={(e) => {
                handleMarkChange(
                  `${folder.id}-marksDifference`,
                  e.target.value
                );
              }}
              type="text"
              placeholder="Marks Difference"
              defaultValue={
                (currentQuestion?.length > 0 || currentQuestion !== undefined) &&
                parseInt(currentQuestion[0]?.questionsName) === folderId
                  ? currentQuestion[0]?.marksDifference
                  : ""
              }
              className="ml-2 w-[8rem] rounded border px-3 py-1 text-sm"
            />

            <input
              type="checkbox"
              className="ml-2 cursor-pointer"
              defaultChecked={
                (currentQuestion?.length > 0 || currentQuestion !== undefined) &&
                parseInt(currentQuestion[0]?.questionsName) === folderId
                  ? currentQuestion[0]?.isSubQuestion
                  : false
              }
              onChange={() => {
                toggleInputsVisibility(folder?.id);
                setIsSubQuestion((prev) => !prev);
              }}
            />

            <label className="text-sm font-medium text-gray-700">
              Sub Questions
            </label>
            <button
              className="font-md rounded-lg border-2 border-gray-900 bg-blue-800 px-3 text-white"
              disabled={isSaving}
              onClick={() =>
                handleSubQuestionsChange(folder, countRef?.current?.value)
              }
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>

          {/* Sub Questions Input Fields */}
          {folder.showInputs && (
            <div className="ml-12 mt-4 flex items-center gap-4">
              <label className="ml-2 text-sm text-gray-700">
                No. of Sub-Questions:
              </label>
              <input
                onChange={(e) => {
                  handleMarkChange(
                    `${folder.id}-numberOfSubQuestions`,
                    e.target.value
                  );
                }}
                type="text"
                className="w-12 rounded border px-3 py-1 text-sm"
                defaultValue={
                  (currentQuestion?.length > 0 ||
                    currentQuestion !== undefined) &&
                  parseInt(currentQuestion[0]?.questionsName) === folderId
                    ? currentQuestion[0]?.numberOfSubQuestions
                    : ""
                }
              />
              <label className="ml-2 text-sm text-gray-700">
                No. of compulsory Sub-Questions
              </label>
              <input
                onChange={(e) => {
                  handleMarkChange(
                    `${folder.id}-compulsorySubQuestions`,
                    e.target.value
                  );
                }}
                type="text"
                defaultValue={
                  (currentQuestion?.length > 0 ||
                    currentQuestion !== undefined) &&
                  parseInt(currentQuestion[0]?.questionsName) === folderId
                    ? currentQuestion[0]?.compulsorySubQuestions
                    : ""
                }
                className="ml-2 w-12 rounded border px-2 py-1 text-sm"
              />
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

export default CreateSchemaStructure;
