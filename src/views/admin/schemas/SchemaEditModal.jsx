import React, { useState, useEffect } from "react";
import { GiCrossMark } from "react-icons/gi";

const SchemaEditModal = ({
  editShowModal,
  setEditShowModal,
  selectedSchema,
  handleUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    totalQuestions: "",
    maxMarks: "",
    minMarks: "",
    compulsoryQuestions: "",
    evaluationTime: "",
    isActive: true,
  });

  useEffect(() => {
    if (selectedSchema) {
      setFormData({
        name: selectedSchema.name || "",
        maxMarks: selectedSchema.maxMarks || "",
        minMarks: selectedSchema.minMarks || "",
        totalQuestions: selectedSchema.totalQuestions || "",
        compulsoryQuestions: selectedSchema.compulsoryQuestions || "",
        evaluationTime: selectedSchema.evaluationTime || "",
        isActive: selectedSchema.isActive || true,
        status: false,
      });
    }
  }, [selectedSchema]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!editShowModal) return null;

  return (
    <div className={`bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md ${editShowModal ? "block" : "hidden"}`}>
      <div
        className="fixed inset-0 opacity-60"
        onClick={() => setEditShowModal(false)}
      ></div>
      <div className="m-2 p-5 relative sm:w-full sm:max-w-lg transform rounded-lg bg-white sm:p-8 shadow-lg transition-all dark:bg-navy-700 ">
        <button
          className="absolute right-4 top-4 p-2 text-3xl text-gray-700 hover:text-red-800"
          onClick={() => setEditShowModal(false)} // Close modal
        >
          <GiCrossMark />
        </button>
        <h2 className="mb-6 text-center text-xl sm:text-3xl font-semibold text-indigo-600 dark:text-white">
          Edit Schema
        </h2>

        <div className="sm:space-y-6">
          {/* Input for Schema Name */}
          <div className="mb-2 sm:mb-0">
            <label className="mb-1 sm:mb-2 block text-sm sm:text-lg font-medium text-gray-700 dark:text-white">
              Schema Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-72 sm:w-full rounded-md border border-gray-300 dark:border-gray-700 py-1 px-2 sm:p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
            />
          </div>

          {/* Input for Maximum Marks */}
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="mb-2 sm:mb-0">
              <label className="mb-1 sm:mb-2 block text-sm sm:text-lg font-medium text-gray-700 dark:text-white">
                Maximum Marks
              </label>
              <input
                type="number"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-1 px-2 sm:p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-800 dark:text-white"
              />
            </div>
            <div className="mb-2 sm:mb-0">
              <label className="mb-1 sm:mb-2 block text-sm sm:text-lg font-medium text-gray-700 dark:text-white">
                Minimum Marks
              </label>
              <input
                type="number"
                name="minMarks"
                value={formData.minMarks}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-1 px-2 sm:p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
              />
            </div>
          </div>
          {/* Input for Total Questions */}
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="mb-2 sm:mb-0">
              <label className="mb-1 sm:mb-2 block text-sm sm:text-lg font-medium text-gray-700 dark:text-white">
                Total Questions
              </label>
              <input
                type="number"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-1 px-2 sm:p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
              />
            </div>
            <div className="mb-2 sm:mb-0">
              <label className="mb-1 sm:mb-2 block text-sm sm:text-lg font-medium text-gray-700 dark:text-white">
                Compulsory Questions
              </label>
              <input
                type="number"
                name="compulsoryQuestions"
                value={formData.compulsoryQuestions}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-1 px-2 sm:p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
              />
            </div>
          </div>

          {/* Input for Compulsory Questions */}

          {/* Input for Evaluation Time */}
          <div className="mb-2 sm:mb-0">
            <label className="mb-1 sm:mb-2 block text-sm sm:text-lg font-medium text-gray-700 dark:text-white">
              Evaluation Time (minutes)
            </label>
            <input
              type="number"
              name="evaluationTime"
              value={formData.evaluationTime}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-1 px-2 sm:p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-800 dark:text-white"
            />
          </div>
        </div>

        {/* Update button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              handleUpdate(selectedSchema._id, formData);
            }}
            className="rounded-md bg-indigo-600 px-3 py-1.5 sm:px-6 sm:py-3 text-white transition-colors hover:bg-indigo-700"
          >
            Update Schema
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemaEditModal;
