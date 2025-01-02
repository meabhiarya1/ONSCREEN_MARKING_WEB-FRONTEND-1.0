import axios from "axios";
import React, { useState, useEffect } from "react";
import { GiCrossMark } from "react-icons/gi";
import { toast } from "react-toastify";

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

  const validationCheck = async () => {
    if (
      !formData.name ||
      !formData.maxMarks ||
      !formData.minMarks ||
      !formData.totalQuestions ||
      !formData.compulsoryQuestions ||
      !formData.evaluationTime
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!formData.name || formData?.name.trim().length === 0) {
      toast.error("Name is required.");
      return;
    }
    if (!formData.maxMarks || Number(formData?.maxMarks) < 0) {
      toast.error("Max Marks must be greater than zero.");
      return;
    }

    if (
      !formData.minMarks ||
      Number(formData?.minMarks) < 0 ||
      Number(formData?.minMarks) > Number(formData?.maxMarks)
    ) {
      toast.error(
        "Min Marks must be a positive number and less than or equal to Max Marks."
      );
      return;
    }

    if (!formData.totalQuestions || Number(formData?.totalQuestions) <= 0) {
      toast.error("Total Questions must be greater than zero.");
      return;
    }

    // Validate compulsoryQuestions
    if (
      !formData.compulsoryQuestions ||
      Number(formData?.compulsoryQuestions) < 0
    ) {
      toast.error("Compulsory Questions must be a postive number.");
      return;
    }

    if (
      Number(formData?.compulsoryQuestions) > Number(formData?.totalQuestions)
    ) {
      toast.error("Compulsory Questions cannot be more than Total Question.");
      return;
    }

    if (!formData.evaluationTime || Number(formData?.evaluationTime) < 0) {
      toast.error("Evaluation Time must be a postive number.");
      return;
    }

    try {
      handleUpdate(selectedSchema._id, formData);
      setEditShowModal(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  if (!editShowModal) return null;

  return (
    <div
      className={`bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md ${
        editShowModal ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 opacity-60"
        onClick={() => setEditShowModal(false)}
      ></div>
      <div className="relative m-2 transform rounded-lg bg-white p-5 shadow-lg transition-all dark:bg-navy-700 sm:w-full sm:max-w-lg sm:p-8 ">
        <button
          className="absolute right-4 top-4 p-2 text-3xl text-gray-700 hover:text-red-800"
          onClick={() => setEditShowModal(false)} // Close modal
        >
          <GiCrossMark />
        </button>
        <h2 className="mb-6 text-center text-xl font-semibold text-indigo-600 dark:text-white sm:text-3xl">
          Edit Schema
        </h2>

        <div className="sm:space-y-6">
          {/* Input for Schema Name */}
          <div className="mb-2 sm:mb-0">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg">
              Schema Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-72 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:w-full sm:p-3"
            />
          </div>

          {/* Input for Maximum Marks */}
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="mb-2 sm:mb-0">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg">
                Maximum Marks
              </label>
              <input
                type="number"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:p-3"
              />
            </div>
            <div className="mb-2 sm:mb-0">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg">
                Minimum Marks
              </label>
              <input
                type="number"
                name="minMarks"
                value={formData.minMarks}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:p-3"
              />
            </div>
          </div>
          {/* Input for Total Questions */}
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="mb-2 sm:mb-0">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg">
                Total Questions
              </label>
              <input
                type="number"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:p-3"
              />
            </div>
            <div className="mb-2 sm:mb-0">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg">
                Compulsory Questions
              </label>
              <input
                type="number"
                name="compulsoryQuestions"
                value={formData.compulsoryQuestions}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:p-3"
              />
            </div>
          </div>

          {/* Input for Compulsory Questions */}

          {/* Input for Evaluation Time */}
          <div className="mb-2 sm:mb-0">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg">
              Evaluation Time (minutes)
            </label>
            <input
              type="number"
              name="evaluationTime"
              value={formData.evaluationTime}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:p-3"
            />
          </div>
        </div>

        {/* Update button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              validationCheck();
            }}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-white transition-colors hover:bg-indigo-700 sm:px-6 sm:py-3"
          >
            Update Schema
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemaEditModal;
