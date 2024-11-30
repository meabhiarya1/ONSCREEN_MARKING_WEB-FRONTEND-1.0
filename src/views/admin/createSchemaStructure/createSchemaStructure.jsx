import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CreateSchemaStructure = () => {
  const [schemaData, setSchemaData] = useState(null);
  const [folders, setFolders] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const countRef = useRef(); // Ref for number of sub-questions
  const formRefs = useRef({}); // Ref object to hold form input values for each folder
  const [isSubQuestion, setIsSubQuestion] = useState(false); // Track if it's a sub-question
  const [questionData, setQuestionData] = useState({}); // Store question data

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

  const generateFolders = (count) => {
    const folders = [];
    for (let i = 1; i <= count; i++) {
      folders.push({ id: i, name: `Q. ${i}`, children: [], showInputs: false });
    }
    return folders;
  };

  const handleSubQuestionsChange = (folder, count) => {
    const folderId = folder.id;
    const numSubQuestions = parseInt(count) || 0;

    // Validate the fields before proceeding
    const minMarks = formRefs.current[`${folderId}-minMarks`]?.value;
    const maxMarks = formRefs.current[`${folderId}-maxMarks`]?.value;
    const bonusMarks = formRefs.current[`${folderId}-bonusMarks`]?.value;
    const marksDifference =
      formRefs.current[`${folderId}-marksDifference`]?.value;

    if (!minMarks || !maxMarks || !bonusMarks || !marksDifference) {
      toast.error("Please fill all the required fields");
      return;
    }

    // Handle sub-question fields if sub-questions are enabled
    let numberOfSubQuestions = 0;
    let compulsorySubQuestions = 0;

    if (isSubQuestion) {
      numberOfSubQuestions =
        formRefs.current[`${folderId}-numberOfSubQuestions`]?.value || 0;
      compulsorySubQuestions =
        formRefs.current[`${folderId}-compulsorySubQuestions`]?.value || 0;

      if (!numberOfSubQuestions || !compulsorySubQuestions) {
        toast.error("Please fill all sub-question related fields");
        return;
      }
    }

    // Update the questionData object
    const updatedQuestionData = {
      ...questionData,
      [folderId]: {
        schemaId: id,
        questionsName: folderId,
        isSubQuestion,
        minMarks,
        maxMarks,
        bonusMarks,
        marksDifference,
        numberOfSubQuestions: parseInt(numberOfSubQuestions),
        compulsorySubQuestions: parseInt(compulsorySubQuestions),
      },
    };

    // Log the updated question data for debugging
    console.log("Updated Question Data:", updatedQuestionData);

    // Update state with the new questionData
    setQuestionData(updatedQuestionData);

    // Proceed with updating folders
    const updateFolders = (folders) =>
      folders.map((folder) => {
        if (folder.id === folderId) {
          const children = Array.from({ length: numSubQuestions }, (_, i) => ({
            id: `${folderId}-${i + 1}`,
            name: `Q. ${folderId}.${i + 1}`,
            children: [],
            showInputs: false,
          }));
          return { ...folder, children };
        }
        if (folder.children.length > 0) {
          return { ...folder, children: updateFolders(folder.children) };
        }
        return folder;
      });

    setFolders((prevFolders) => updateFolders(prevFolders));
  };

  const toggleInputsVisibility = (folderId) => {
    const updateFolders = (folders) =>
      folders.map((folder) => {
        if (folder.id === folderId) {
          return { ...folder, showInputs: !folder.showInputs };
        }
        if (folder.children.length > 0) {
          return { ...folder, children: updateFolders(folder.children) };
        }
        return folder;
      });

    setFolders((prevFolders) => updateFolders(prevFolders));
  };

  const renderFolder = (folder, level = 0, isLastChild = false) => {
    const folderStyle = `relative ml-${level * 4} mt-3`;
    const color = level % 2 === 0 ? "bg-[#f4f4f4]" : "bg-[#fafafa]";

    return (
      <div
        className={`${folderStyle} p-4 ${color} rounded shadow`}
        key={folder.id}
      >
        {/* Curved Vertical Line */}
        {level > 0 && (
          <div
            className={`absolute left-[-16px] top-[-16px] ${
              isLastChild ? "h-1/2" : "h-full"
            } w-[2px] rounded-[12px] border-l-2 border-[#8a8a8a] bg-gradient-to-b from-gray-400 to-gray-500`}
          ></div>
        )}

        {/* Horizontal Connector */}
        {level > 0 && (
          <div className="absolute left-[-16px] top-[16px] h-[2px] w-4 rounded-md bg-gradient-to-r from-gray-400 to-gray-500"></div>
        )}

        {/* Folder Header */}
        <div className="w-full flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="text-black-500 font-semibold">
              📁 {folder.name}
            </span>

            {/* Marks Input Fields */}
            <input
              ref={(el) => (formRefs.current[`${folder.id}-minMarks`] = el)}
              type="text"
              placeholder="Min"
              className="ml-2 w-12 rounded border px-2 py-1 text-sm"
            />
            <input
              ref={(el) => (formRefs.current[`${folder.id}-maxMarks`] = el)}
              type="text"
              placeholder="Max"
              className="ml-2 w-12 rounded border px-2 py-1 text-sm"
            />
            <input
              ref={(el) => (formRefs.current[`${folder.id}-bonusMarks`] = el)}
              type="text"
              placeholder="Bonus"
              className="ml-2 w-14 rounded border px-2 py-1 text-sm"
            />
            <input
              ref={(el) =>
                (formRefs.current[`${folder.id}-marksDifference`] = el)
              }
              type="text"
              placeholder="Marks Difference"
              className="ml-2 w-[8rem] rounded border px-3 py-1 text-sm"
            />
            <input
              type="checkbox"
              className="ml-2 cursor-pointer"
              onChange={() => {
                toggleInputsVisibility(folder.id);
                setIsSubQuestion((prev) => !prev);
              }}
            />
            <label className="text-sm font-medium text-gray-700">
              Sub Questions
            </label>
            <button
              className="font-md rounded-lg border-2 border-gray-900 bg-blue-800 px-3 text-white"
              onClick={() =>
                handleSubQuestionsChange(folder, countRef.current?.value)
              }
            >
              Save
            </button>
          </div>

          {/* Sub Questions Input Fields */}
          <div className="ml-12 mt-4 flex items-center gap-4">
            {folder.showInputs && (
              <>
                <label className="ml-2 text-sm text-gray-700">
                  No. of Sub-Questions:
                </label>
                <input
                  ref={(el) =>
                    (formRefs.current[`${folder.id}-numberOfSubQuestions`] = el)
                  }
                  type="text"
                  className="w-12 rounded border px-3 py-1 text-sm"
                />
                <label className="ml-2 text-sm text-gray-700 ">
                  No. of compulsory questions
                </label>
                <input
                  ref={(el) =>
                    (formRefs.current[`${folder.id}-compulsorySubQuestions`] =
                      el)
                  }
                  type="text"
                  className="ml-2 w-12 rounded border px-2 py-1 text-sm"
                />
              </>
            )}
          </div>
        </div>

        {/* Render children (sub-questions) recursively */}
        {folder.children?.map((child, index) =>
          renderFolder(child, level + 1, index === folder.children.length - 1)
        )}
      </div>
    );
  };

  console.log(questionData);

  return (
    <div className="overflow-hidden rounded-lg shadow">
      {folders.map((folder) => renderFolder(folder))}
    </div>
  );
};

export default CreateSchemaStructure;
