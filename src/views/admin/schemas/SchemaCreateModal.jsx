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
    status: false,
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md ${
        createShowModal ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 opacity-60"
        onClick={() => setCreateShowModal(false)}
      ></div>

      <div className="z-10 m-2 transform-gpu rounded-lg bg-white p-5 shadow-xl transition-transform dark:bg-navy-700 sm:w-11/12 sm:max-w-lg sm:p-8">
        {/* Close button */}
        <button
          className="absolute right-4 top-4 p-2 text-3xl text-gray-700 hover:text-red-700"
          onClick={() => setCreateShowModal(false)}
        >
          <GiCrossMark />
        </button>

        {/* Header */}
        <h2 className="mb-3 text-center text-xl font-semibold text-indigo-800 dark:text-white sm:mb-6 sm:text-3xl">
          Create Schema
        </h2>

        <form onSubmit={handleSubmit} className="sm:space-y-6">
          {/* Schema Name */}
          <div className="mb-2 sm:mb-0">
            <label
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg"
              htmlFor="name"
            >
              Schema Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-72 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:w-full sm:px-4 sm:py-2"
            />
          </div>

          {/* Total Questions */}
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="mb-2 sm:mb-0">
              <label
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg"
                htmlFor="totalQuestions"
              >
                Total Questions:
              </label>
              <input
                type="number"
                id="totalQuestions"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleChange}
                className="w-72 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:w-full sm:px-4 sm:py-2"
              />
            </div>
            <div className="mb-2 sm:mb-0">
              <label
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg"
                htmlFor="maxMarks"
              >
                Max Marks:
              </label>
              <input
                type="number"
                id="maxMarks"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleChange}
                className="w-72 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:w-full sm:px-4 sm:py-2"
              />
            </div>
          </div>
          {/* Min Marks */}
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="mb-2 sm:mb-0">
              <label
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg"
                htmlFor="minMarks"
              >
                Min Marks:
              </label>
              <input
                type="number"
                id="minMarks"
                name="minMarks"
                value={formData.minMarks}
                onChange={handleChange}
                className="w-72 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:w-full sm:px-4 sm:py-2"
              />
            </div>
            <div className="mb-2 sm:mb-0">
              <label
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg"
                htmlFor="compulsoryQuestions"
              >
                Compulsory Questions:
              </label>
              <input
                type="number"
                id="compulsoryQuestions"
                name="compulsoryQuestions"
                value={formData.compulsoryQuestions}
                onChange={handleChange}
                className="w-72 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:w-full sm:px-4 sm:py-2"
              />
            </div>
          </div>
          <div className="mb-2 sm:mb-0">
            <label
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-white sm:mb-2 sm:text-lg"
              htmlFor="evaluationTime"
            >
              Evaluation Time (in minutes):
            </label>
            <input
              type="number"
              id="evaluationTime"
              name="evaluationTime"
              value={formData.evaluationTime}
              onChange={handleChange}
              className="w-72 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-800 dark:text-white sm:w-full sm:px-4 sm:py-2"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4 sm:mt-6">
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 py-1.5 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-3"
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
