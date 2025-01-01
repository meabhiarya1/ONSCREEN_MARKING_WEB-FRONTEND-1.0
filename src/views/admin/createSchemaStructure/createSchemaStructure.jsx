import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { isAction } from "@reduxjs/toolkit";

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
  const [parentId, setParentId] = useState([]); // Track parent folder
  const [currentQuestionNo, setCurrentQuesNo] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [subQuestionsFirst, setSubQuestionsFirst] = useState([]);
  // const [allottedQuestionRemaining, setAllottedQuestionRemaining] = useState(0);

  useEffect(() => {
    if (currentQuestionNo && !/^\d+-\d+$/.test(currentQuestionNo)) {
      // Only setParentId([]) if currentQuestionNo does NOT match the pattern
      setParentId([]);
    }
  }, [currentQuestionNo]);

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

        setSchemaData((prev) => ({ ...prev, ...data }));
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
        const data = response?.data.data || []; // Fallback to an empty array if no data
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

  const extractParentId = (key, arrayOfObjects) => {
    for (let obj of arrayOfObjects) {
      if (obj.hasOwnProperty(key)) {
        return obj[key];
      }
    }
    return null;
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

  const handleSubQuestionsChange = async (folder, _, level) => {
    const folderId = folder.id;
    setCurrentQuesNo(folderId);

    if (savingStatus[folderId]) return;

    const currentQ =
      savedQuestionData &&
      savedQuestionData?.filter(
        (item) => parseInt(item.questionsName) === folderId
      );

    // console.log(currentQ);

    setCurrentQuestion(currentQ);

    const minMarks =
      formRefs?.current[`${folderId}-minMarks`] ||
      (currentQ && currentQ[0]?.minMarks);
    const maxMarks =
      formRefs?.current[`${folderId}-maxMarks`] ||
      (currentQ && currentQ[0]?.maxMarks);
    const bonusMarks =
      formRefs?.current[`${folderId}-bonusMarks`] ||
      (currentQ && currentQ[0]?.bonusMarks);
    const marksDifference =
      formRefs.current[`${folderId}-marksDifference`] ||
      (currentQ && currentQ[0]?.marksDifference);

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
        : currentQ?.length > 0 || currentQ !== undefined
        ? currentQ[0]?.numberOfSubQuestions
        : "";

      //compulsorySubQuestions
      compulsorySubQuestions += formRefs?.current[
        `${folderId}-compulsorySubQuestions`
      ]
        ? formRefs?.current[`${folderId}-compulsorySubQuestions`]
        : currentQ?.length > 0 || currentQ !== undefined
        ? currentQ[0]?.compulsorySubQuestions
        : "";

      if (!numberOfSubQuestions || !compulsorySubQuestions) {
        toast.error("Please fill all sub-question related fields");
        return;
      }
    }

    const updatedQuestionData = {
      schemaId: id,
      questionsName: folderId,
      isSubQuestion: folder.isSubQuestion,
      minMarks,
      maxMarks,
      bonusMarks,
      marksDifference,
      numberOfSubQuestions: parseInt(numberOfSubQuestions),
      compulsorySubQuestions: parseInt(compulsorySubQuestions),
      parentQuestionId: extractParentId(level, parentId) || null,
    };

    setSavingStatus((prev) => ({ ...prev, [folderId]: true }));

    try {
      if (currentQ && currentQ.length > 0) {
        console.log("put");
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/schemas/update/questiondefinition/${currentQ[0]?._id}`,
          updatedQuestionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedQuestionData((prev) => {
          const newData = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]; // Wrap it in an array if it's not already an array
          return [...prev, ...newData];
        });

        toast.success(response?.data?.message);

        const obj = { [level + 1]: response.data.data._id };
        setParentId([...parentId, obj]);
      } else {
        console.log("post");
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
        setSavedQuestionData((prev) => {
          const newData = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]; // Wrap it in an array if it's not already an array
          return [...prev, ...newData];
        });

        const obj = { [level + 1]: response.data.data._id };
        setParentId([...parentId, obj]);
      }

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
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleFinalSubmit = () => {
    const updatedSchemaData = {
      ...schemaData,
      status: true,
      isActive: true,
    };

    try {
      const response = axios.put(
        `${process.env.REACT_APP_API_URL}/api/schemas/update/schema/${id}`,
        updatedSchemaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Schema data updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const renderFolder = (folder, level = 0, isLastChild = false) => {
    const folderId = folder.id;
    const isSaving = savingStatus[folderId] || false; // Check saving status for this folder
    const folderStyle = `relative ml-${level * 4} mt-3`;
    const color = level % 2 === 0 ? "bg-[#f4f4f4]" : "bg-[#fafafa]";

    // console.log("folderId", folderId);

    const handleMarkChange = (inputBoxName, inputValue) => {
      setCurrentQuesNo(folderId);
      formRefs.current[inputBoxName] = inputValue;
    };

    let currentQ = [];

    if (subQuestionsFirst && subQuestionsFirst.length > 0) {
      currentQ =
        subQuestionsFirst &&
        subQuestionsFirst?.filter(
          (item) => parseInt(item.questionsName) === folderId
        );
    } else {
      currentQ =
        savedQuestionData &&
        savedQuestionData?.filter(
          (item) => parseInt(item.questionsName) === folderId
        );
    }

    // console.log("currentQuestion", currentQuestion);
    // setCurrentQuestion(currentQ);

    return (
      <div
        className={`${folderStyle} p-4 ${color} rounded-md shadow bg-white dark:bg-navy-900 dark:text-white`}
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

            <input
              onChange={(e) => {
                handleMarkChange(`${folder.id}-maxMarks`, e.target.value);
              }}
              type="text"
              placeholder="Max"
              className="ml-2 w-12 rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
              defaultValue={
                (currentQ?.length > 0 || currentQ !== undefined) &&
                parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.maxMarks
                  : ""
              }
            />

            <input
              onChange={(e) => {
                handleMarkChange(`${folder.id}-minMarks`, e.target.value);
              }}
              type="text"
              placeholder="Min"
              defaultValue={
                (currentQ?.length > 0 || currentQ !== undefined) &&
                parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.minMarks
                  : ""
              }
              className="ml-2 w-12 rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
            />

            <input
              onChange={(e) => {
                handleMarkChange(`${folder.id}-bonusMarks`, e.target.value);
              }}
              type="text"
              placeholder="Bonus"
              className="ml-2 w-14 rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
              defaultValue={
                (currentQ?.length > 0 || currentQ !== undefined) &&
                parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.bonusMarks
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
                (currentQ?.length > 0 || currentQ !== undefined) &&
                parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.marksDifference
                  : ""
              }
              className="ml-2 w-[8rem] rounded border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
            />

            <input
              type="checkbox"
              className="ml-2 cursor-pointer"
              defaultChecked={
                (currentQ?.length > 0 || currentQ !== undefined) &&
                parseInt(currentQ[0]?.questionsName) === folderId
                  ? currentQ[0]?.isSubQuestion
                  : false
              }
              onChange={() => {
                toggleInputsVisibility(folder?.id);
                setIsSubQuestion((prev) => !prev);
              }}
            />

            <label className="text-sm font-medium text-gray-700 dark:text-white">
              Sub Questions
            </label>
            <button
              className="font-md rounded-lg border-2 border-gray-900 bg-indigo-700 hover:bg-indigo-800 px-3 py-1 text-white"
              disabled={isSaving}
              onClick={() =>
                handleSubQuestionsChange(
                  folder,
                  countRef?.current?.value,
                  level
                )
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
                  (currentQ?.length > 0 || currentQ !== undefined) &&
                  parseInt(currentQ[0]?.questionsName) === folderId
                    ? currentQ[0]?.numberOfSubQuestions
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
                  (currentQ?.length > 0 || currentQ !== undefined) &&
                  parseInt(currentQ[0]?.questionsName) === folderId
                    ? currentQ[0]?.compulsorySubQuestions
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
    <div className="custom-scrollbar min-h-screen overflow-hidden rounded-lg bg-lightPrimary p-6 mt-2 dark:bg-navy-700 dark:text-white">
      {/* <div className="max-h-[75vh] min-w-[1000px] overflow-auto rounded-lg border border-gray-300 p-4"> */}
        <div className="flex justify-between mb-5">
          <span className="cursor-pointer rounded-lg bg-indigo-700 px-4 py-2 text-white hover:bg-indigo-800">
            Remaining Marks To Allot:{" "}
            {schemaData?.totalQuestions - savedQuestionData?.length === 0
              ? 0
              : schemaData?.totalQuestions - savedQuestionData?.length}
          </span>
          <span
            className="cursor-pointer rounded-lg bg-indigo-700 px-4 py-2 text-white hover:bg-indigo-800"
            onClick={handleFinalSubmit}
          >
            Submit
          </span>
        </div>
        {folders.map((folder) => renderFolder(folder))}
      {/* </div> */}
    </div>  
  );
};

export default CreateSchemaStructure;
