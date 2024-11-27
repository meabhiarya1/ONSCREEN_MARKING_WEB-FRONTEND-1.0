import React, { useState, useEffect } from "react";

const SchemaEditModal = ({
  editShowModal,
  setEditShowModal,
  selectedSchema,
  handleUpdate,
}) => {
  // Initialize state to manage input values
  const [formData, setFormData] = useState({
    name: "",
    totalQuestions: "",
    maxMarks: "",
    minMarks: "",
    compulsoryQuestions: "",
    evaluationTime: "",
    isActive: true,
  });

  // Update state when selectedSchema changes
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
      });
    }
  }, [selectedSchema]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Don't render modal if editShowModal is false
  if (!editShowModal) return null;

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <button
          className="absolute right-2 top-2 text-2xl text-gray-600 hover:text-gray-900"
          onClick={() => setEditShowModal(false)} // Close modal
        >
          &times;
        </button>

        <h2 className="mb-4 text-lg font-medium">Edit Schema</h2>

        <div className="space-y-4">
          {/* Input for Schema Name */}
          <div>
            <label className="block text-gray-700">Schema Name</label>
            <input
              type="text"
              name="name" // corrected name to match the state variable
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>

          {/* Input for Maximum Marks */}
          <div>
            <label className="block text-gray-700">Maximum Marks</label>
            <input
              type="number"
              name="maxMarks"
              value={formData.maxMarks}
              onChange={handleInputChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>

          {/* Input for Minimum Marks */}
          <div>
            <label className="block text-gray-700">Minimum Marks</label>
            <input
              type="number"
              name="minMarks"
              value={formData.minMarks}
              onChange={handleInputChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>

          {/* Input for Total Questions */}
          <div>
            <label className="block text-gray-700">Total Questions</label>
            <input
              type="number"
              name="totalQuestions"
              value={formData.totalQuestions}
              onChange={handleInputChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>

          {/* Input for Compulsory Questions */}
          <div>
            <label className="block text-gray-700">Compulsory Questions</label>
            <input
              type="number"
              name="compulsoryQuestions"
              value={formData.compulsoryQuestions}
              onChange={handleInputChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>

          {/* Input for Evaluation Time */}
          <div>
            <label className="block text-gray-700">Evaluation Time</label>
            <input
              type="number"
              name="evaluationTime"
              value={formData.evaluationTime}
              onChange={handleInputChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
        </div>

        {/* Update button */}
        <div className="mt-6 text-right">
          <button
            onClick={() => {
              handleUpdate(selectedSchema._id, formData);
            }}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Update Schema
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemaEditModal;
