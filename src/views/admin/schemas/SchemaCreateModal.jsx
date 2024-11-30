import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { GiCrossMark } from "react-icons/gi";

const SchemaCreateModal = ({ setCreateShowModal, createShowModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    totalQuestions: "",
    maxMarks: "",
    minMarks: "",
    compulsoryQuestions: "",
    evaluationTime: "",
    isActive: true,
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (!formData) {
      toast.warning("All fields are required.");
      return;
    }

    // Validate compulsoryQuestions
    if (!formData.compulsoryQuestions || Number(formData?.compulsoryQuestions) < 0) {
      toast.warning("Compulsory Questions must be a postive number.");
      return;
    }

    if (!formData.evaluationTime || Number(formData?.evaluationTime) < 0) {
      toast.warning("Evaluation Time must be a non-negative number.");
      return;
    }

    if (!formData.maxMarks || Number(formData?.maxMarks) < 0) {
      toast.warning("Max Marks must be greater than zero.");
      return;
    }

    if (!formData.minMarks || Number(formData?.minMarks) < 0 || Number(formData?.minMarks) > Number(formData?.maxMarks)) {
      toast.warning("Min Marks must be a positive number and less than or equal to Max Marks.");
      return;
    }

    if (!formData.name || formData?.name.trim().length === 0) {
      toast.warning("Name is required.");
      return;
    }

    if (!formData.totalQuestions || Number(formData?.totalQuestions) <= 0) {
      toast.warning("Total Questions must be greater than zero.");
      return;
    }


    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/schemas/create/schema`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        name: "",
        totalQuestions: "",
        maxMarks: "",
        minMarks: "",
        compulsoryQuestions: "",
        evaluationTime: "",
        isActive: true,
      });
      setCreateShowModal(false);
      toast.success("Schema created successfully!");
      console.log(response);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${createShowModal ? "block" : "hidden"}`}
    >
      <div
        className="fixed inset-0 bg-gray-800 opacity-60 backdrop-blur-md"
        onClick={() => setCreateShowModal(false)}
      ></div>

      <div className="z-10 w-11/12 max-w-lg transform-gpu rounded-lg bg-white p-8 shadow-xl transition-transform">
        {/* Close button */}
        <button
          className="absolute right-4 top-4 text-3xl p-2 text-gray-700 hover:text-red-700"
          onClick={() => setCreateShowModal(false)}
        >
          <GiCrossMark />
        </button>

        {/* Header */}
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">Create Schema</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Schema Name */}
          <div>
            <label className="mb-2 block text-lg font-medium text-gray-700" htmlFor="name">
              Schema Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Total Questions */}
          <div className="flex justify-between">
            <div>
              <label className="mb-2 block text-lg font-medium text-gray-700" htmlFor="totalQuestions">
                Total Questions:
              </label>
              <input
                type="number"
                id="totalQuestions"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-lg font-medium text-gray-700" htmlFor="maxMarks">
                Max Marks:
              </label>
              <input
                type="number"
                id="maxMarks"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Min Marks */}
          <div className="flex justify-between">
            <div>
              <label className="mb-2 block text-lg font-medium text-gray-700" htmlFor="minMarks">
                Min Marks:
              </label>
              <input
                type="number"
                id="minMarks"
                name="minMarks"
                value={formData.minMarks}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-lg font-medium text-gray-700" htmlFor="compulsoryQuestions">
                Compulsory Questions:
              </label>
              <input
                type="number"
                id="compulsoryQuestions"
                name="compulsoryQuestions"
                value={formData.compulsoryQuestions}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-lg font-medium text-gray-700" htmlFor="evaluationTime">
              Evaluation Time (in minutes):
            </label>
            <input
              type="number"
              id="evaluationTime"
              name="evaluationTime"
              value={formData.evaluationTime}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 text-white font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Schema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemaCreateModal;
