import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SelectSchemaModal = ({ setShowModal, showModal }) => {
  const [schemas, setSchemas] = useState([]); // To hold the schema data
  const [selectedSchema, setSelectedSchema] = useState(""); // To store the selected schema ID
  const [selectedSchemaData, setSelectedSchemaData] = useState(null); // To store the full selected schema
  const { id } = useParams(); // Get subjectId from params
  const navigate = useNavigate();

  // Fetch schemas on component mount
  useEffect(() => {
    const fetchSchemaData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/schemas/getall/schema`
        );
        setSchemas(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSchemaData();
  }, []);

  // Update selectedSchemaData when selectedSchema changes
  useEffect(() => {
    if (selectedSchema) {
      const schemaData = schemas.find(
        (schema) => schema.name === selectedSchema
      );
      setSelectedSchemaData(schemaData); // Set the full schema data
    }
  }, [selectedSchema, schemas]);

  // Handle submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subject ID:", id); // Log the subject ID
    console.log("Selected Schema ID:", selectedSchema); // Log the selected schema ID
    console.log("Selected Schema Data:", selectedSchemaData); // Log the full selected schema data
    navigate(`/admin/schema/create/${selectedSchemaData._id}`);
    setShowModal(false); // Close the modal
  };

  if (!showModal) return null; // Don't render modal if showModal is false

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {/* Close button */}
        <button
          className="absolute right-2 top-2 text-2xl font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={() => setShowModal(false)}
        >
          &times;
        </button>

        {/* Modal content */}
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">
            Please select a schema:
          </h3>

          {/* Dropdown for selecting schema */}
          <select
            value={selectedSchema}
            onChange={(e) => setSelectedSchema(e.target.value)} // Set selected schema
            className="mb-5 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a schema</option>
            {schemas.map((schema) => (
              <option key={schema.id} value={schema.id}>
                {schema.name}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSubmit} // Call handleSubmit on click
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Submit
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-900 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectSchemaModal;
