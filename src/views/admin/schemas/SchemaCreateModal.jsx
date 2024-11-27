import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

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

  // console.log(formData);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
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
      toast.success("Schema created successfully!");
      console.log(response);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setCreateShowModal(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        createShowModal ? "block" : "hidden"
      }`}
    >
      <div
        className="bg-black fixed inset-0 opacity-60"
        onClick={() => setCreateShowModal(false)}
      ></div>
      <div className="z-10 w-11/12 max-w-md transform-gpu rounded-lg bg-white p-8 shadow-lg transition-transform">
        <button
          className="absolute right-2 top-2 text-4xl text-gray-500 transition-colors hover:text-gray-700"
          onClick={() => setCreateShowModal(false)}
        >
          &times;
        </button>
        <h2 className="mb-4 text-center text-2xl font-semibold">
          Create Schema
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="mb-2 block" htmlFor="name">
            Schema Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name} 
            onChange={handleChange}
            required
            className="mb-4 w-full rounded-md border border-gray-300 px-2 py-1  shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />

          <label className="mb-2 block" htmlFor="totalQuestions">
            Total Questions:
          </label>
          <input
            type="number"
            id="totalQuestions"
            name="totalQuestions"
            value={formData.totalQuestions}
            onChange={handleChange}
            required
            className="mb-4 w-full rounded-md border border-gray-300 px-2 py-1  shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />

          <label className="mb-2 block" htmlFor="maxMarks">
            Max Marks:
          </label>
          <input
            type="number"
            id="maxMarks"
            name="maxMarks"
            value={formData.maxMarks}
            onChange={handleChange}
            required
            className="mb-4 w-full rounded-md border border-gray-300 px-2 py-1  shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />

          <label className="mb-2 block" htmlFor="minMarks">
            Min Marks:
          </label>
          <input
            type="number"
            id="minMarks"
            name="minMarks"
            value={formData.minMarks}
            onChange={handleChange}
            required
            className="mb-4 w-full rounded-md border border-gray-300 px-2 py-1  shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />

          <label className="mb-2 block" htmlFor="minMarks">
            Compulsory Questions:
          </label>
          <input
            type="number"
            id="compulsoryQuestions"
            name="compulsoryQuestions"
            value={formData.compulsoryQuestions}
            onChange={handleChange}
            required
            className="mb-4 w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />

          <label className="mb-2 block" htmlFor="minMarks">
            Evaluation Time:
          </label>
          <input
            type="number"
            id="evaluationTime"
            name="evaluationTime"
            value={formData.evaluationTime}
            onChange={handleChange}
            required
            className="mb-4 w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default SchemaCreateModal;
