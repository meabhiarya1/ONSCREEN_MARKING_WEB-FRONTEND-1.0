import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [parentId, setParentId] = useState([]); // Track parent folder
  const [currentQuestionNo, setCurrentQuesNo] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [subQuestionsFirst, setSubQuestionsFirst] = useState([]);
  const [error, setError] = useState(false);
  const [remainingMarks, setRemainingMarks] = useState("");
  const [questionToAllot, setQuestionToAllot] = useState("");
    const navigate = useNavigate();
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

  // console.log(schemaData);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/api/schemas/getall/questiondefinitions/${id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       const data = response?.data?.data || []; // Simplified fallback
  //       console.log(data);
  //       setSavedQuestionData(data);

  //       const totalMarksUsed = data.reduce(
  //         (acc, question) => acc + (question?.maxMarks || 0),
  //         0
  //       );
  //       setRemainingMarks((schemaData?.maxMarks || 0) - totalMarksUsed);

  //       const remainingQuestions =
  //         (schemaData?.totalQuestions || 0) - data.length;
  //       setQuestionToAllot(remainingQuestions > 0 ? remainingQuestions : 0);

  //       // toast.success("Question data fetched successfully");
  //     } catch (error) {
  //       console.error("Error fetching schema data:", error);
  //       setSavedQuestionData([]); // Reset on error
  //       // toast.error(error?.response?.data?.message || "Failed to fetch data");
  //     }
  //   };

  //   if (id && token) fetchData(); // Prevent unnecessary calls if missing params
  // }, [id, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/schemas/getall/questiondefinitions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(schemaData)
        const data = response?.data?.data || [];
        setSavedQuestionData(data);

        // console.log(data);

        const totalMarksUsed = data.reduce(
          (acc, question) => acc + (question?.maxMarks || 0),
          0
        );
        console.log(totalMarksUsed);
        setRemainingMarks((schemaData?.maxMarks || 0) - totalMarksUsed);

        const remainingQuestions =
          (schemaData?.totalQuestions || 0) - data.length;
        setQuestionToAllot(remainingQuestions > 0 ? remainingQuestions : 0);

        // console.log(totalMarksUsed, remainingQuestions)
      } catch (error) {
        console.error("Error fetching schema data:", error);

        // ✅ Ensure the state resets to an empty array on 404 or other errors
        if (error.response?.status === 404) {
          setSavedQuestionData([]);
        }
      }
    };

    fetchData();
  }, [id, token, schemaData, setSavedQuestionData, parentId]);

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

    if (error)
      return toast.error(
        `Marks cannot be greater than remaining marks in Question: ${folderId}`
      );

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

    if (maxMarks > remainingMarks)
      return toast.error("Max Marks cannot be greater than remaining marks");

    if (minMarks > remainingMarks || minMarks > maxMarks)
      return toast.error(
        "Min Marks cannot be greater than remaining marks or max marks"
      );

    if (maxMarks % marksDifference != 0 || maxMarks < marksDifference)
      return toast.error(
        "Marks Difference cannot be greater than Max marks or Marks Difference Always Multiple of Max marks"
      );

    if (bonusMarks > maxMarks)
      return toast.error("Bonus Marks cannot be greater than Max marks");

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

  const handleFinalSubmit = async () => {
    if (questionToAllot != 0 || remainingMarks != 0) {
      toast.error("Please Allocate all questions & marks!!!");
      return;
    }

    const updatedSchemaData = {
      ...schemaData,
      status: true,
      isActive: true,
    };

    if (remainingMarks) return toast.error("Remaining marks should be 0");

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/schemas/update/schema/${id}`,
        updatedSchemaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response)
      toast.success("Schema data updated successfully");
      navigate(`/admin/schema`);
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error)
    }
  };

  const renderFolder = (folder, level = 0, isLastChild = false) => {
    const folderId = folder.id;
    const isSaving = savingStatus[folderId] || false; // Check saving status for this folder
    const folderStyle = `relative ml-${level * 4} mt-3`;
    const color = level % 2 === 0 ? "bg-[#f4f4f4]" : "bg-[#fafafa]";

    // console.log("folderId", folderId);

    // console.log(remainingMarks);
    const handleMarkChange = (inputBoxName, inputValue) => {
      if (inputBoxName.includes("maxMarks")) {
        if (inputValue > remainingMarks) {
          toast.error("Max Marks cannot be greater than remaining marks");
          setError(true);
          return;
        }
      } else if (inputBoxName.includes("marksDifference")) {
        if (inputValue > remainingMarks) {
          toast.error(
            "Marks Difference cannot be greater than remaining marks"
          );
          setError(true);
          return;
        }
      }
      setCurrentQuesNo(folderId);
      formRefs.current[inputBoxName] = inputValue;
      setError(false);
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
        className={`${folderStyle} p-4 ${color} rounded shadow dark:bg-navy-900 dark:text-white`}
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
        <div className="w-full">
          <div className="flex items-center justify-start gap-6">
            <div className="w-20">
              <span
                className="text-black-500 cursor-pointer font-semibold"
                onClick={() => handleFolderClick(folder.id)}
              >
                📁 {folder?.name}
              </span>
            </div>

            {/* {console.log("currentQuestion", currentQuestion)} */}

            <div className="w-20">
              <input
                onChange={(e) => {
                  handleMarkChange(`${folder.id}-maxMarks`, e.target.value);
                }}
                type="text"
                placeholder="Max"
                className="w-full rounded border border-gray-300 px-2 py-1 text-center focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                defaultValue={
                  (currentQ?.length > 0 || currentQ !== undefined) &&
                  parseInt(currentQ[0]?.questionsName) === folderId
                    ? currentQ[0]?.maxMarks
                    : ""
                }
              />
            </div>

            <div className="w-20">
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
                className="w-full rounded border border-gray-300 py-1 text-center focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
              />
            </div>

            <div className="w-20">
              <input
                onChange={(e) => {
                  handleMarkChange(`${folder.id}-bonusMarks`, e.target.value);
                }}
                type="text"
                placeholder="Bonus"
                className="w-full rounded border border-gray-300 py-1 text-center focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                defaultValue={
                  (currentQ?.length > 0 || currentQ !== undefined) &&
                  parseInt(currentQ[0]?.questionsName) === folderId
                    ? currentQ[0]?.bonusMarks
                    : ""
                }
              />
            </div>

            <div className="w-40">
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
                className="w-full rounded border border-gray-300 py-1 text-center focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
              />
            </div>

            <div className="flex w-28 items-center justify-center gap-2">
              <input
                id="isSubQuestion"
                type="checkbox"
                className="cursor-pointer dark:bg-navy-900 dark:text-white"
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

              <label
                htmlFor="isSubQuestion"
                className="w-full cursor-pointer text-sm font-medium text-gray-700 dark:text-white"
              >
                Sub Questions
              </label>
            </div>

            <div className="w-20">
              <button
                className="font-md w-20 rounded-lg border-2 border-gray-900 bg-blue-800 px-2 py-1.5 text-white"
                disabled={isSaving}
                onClick={() =>
                  handleSubQuestionsChange(
                    folder,
                    countRef?.current?.value,
                    level
                  )
                }
              >
                {isSaving
                  ? "Saving..."
                  : currentQ[0]?.marksDifference
                  ? "Update"
                  : "Save"}
              </button>
            </div>
          </div>

          {/* Sub Questions Input Fields */}
          {folder.showInputs && (
            <div className="ml-12 mt-4 flex items-center gap-4">
              <label className="ml-2 text-sm text-gray-700 dark:text-white">
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
                className="w-20 rounded border border-gray-300 py-1 text-center focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
                defaultValue={
                  (currentQ?.length > 0 || currentQ !== undefined) &&
                  parseInt(currentQ[0]?.questionsName) === folderId
                    ? currentQ[0]?.numberOfSubQuestions
                    : ""
                }
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-white">
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
                className="w-20 rounded border border-gray-300 py-1 text-center focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white"
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
    // <div className="custom-scrollbar min-h-screen overflow-hidden bg-gray-100 p-6">
    <div
      className="max-h-[75vh] min-w-[1000px] space-y-4 overflow-x-auto overflow-y-scroll rounded-lg 
    border border-gray-300 p-4 dark:border-gray-700 dark:bg-navy-700"
    >
      <div className="flex justify-between">
        <span className="cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700">
          {/* {console.log(questionToAllot, remainingMarks, schemaData)} */}
          Questions To Allot: {questionToAllot ? questionToAllot : 0}
        </span>
        <span className="cursor-pointer rounded-lg bg-green-600 p-2 text-white hover:bg-green-700">
          Marks To Allot: {remainingMarks ? remainingMarks : 0}
        </span>
        <span
          className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          onClick={handleFinalSubmit}
        >
          Submit
        </span>
      </div>
      {folders.map((folder) => renderFolder(folder))}
    </div>
    // </div>
  );
};

export default CreateSchemaStructure;
