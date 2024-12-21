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
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative w-full max-w-lg transform rounded-lg bg-white p-8 shadow-lg transition-all">
        <button
          className="absolute right-4 top-4 p-2 text-3xl text-gray-700 hover:text-red-800"
          onClick={() => setEditShowModal(false)} // Close modal
        >
          <GiCrossMark />
        </button>
        <h2 className="mb-6 text-center text-2xl font-semibold text-blue-600">
          Edit Schema
        </h2>

        <div className="space-y-6">
          {/* Input for Schema Name */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Schema Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Input for Maximum Marks */}
          <div className="flex justify-between">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Maximum Marks
              </label>
              <input
                type="number"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Minimum Marks
              </label>
              <input
                type="number"
                name="minMarks"
                value={formData.minMarks}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Input for Total Questions */}
          <div className="flex justify-between">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Total Questions
              </label>
              <input
                type="number"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Compulsory Questions
              </label>
              <input
                type="number"
                name="compulsoryQuestions"
                value={formData.compulsoryQuestions}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Input for Compulsory Questions */}

          {/* Input for Evaluation Time */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Evaluation Time (minutes)
            </label>
            <input
              type="number"
              name="evaluationTime"
              value={formData.evaluationTime}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Update button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              handleUpdate(selectedSchema._id, formData);
            }}
            className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Update Schema
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemaEditModal;
