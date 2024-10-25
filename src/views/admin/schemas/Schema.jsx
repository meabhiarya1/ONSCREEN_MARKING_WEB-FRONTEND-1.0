import React, { useEffect, useState } from "react";
import SchemaEditModal from "./SchemaEditModal";
import SchemaDeleteModal from "./SchemaDeleteModal";
import SchemaCreateModal from "./SchemaCreateModal";
import axios from "axios";
import { toast } from "react-toastify";

const Schema = () => {
  const [editShowModal, setEditShowModal] = useState(false);
  const [createShowModal, setCreateShowModal] = useState(false);
  const [deleteShowModal, setDeleteShowModal] = useState(false);
  const [schemaData, setSchemaData] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);

  useEffect(() => {
    const fetchSchemaData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/schemas/getall/schema`
        );
        setSchemaData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSchemaData();
  }, [setCreateShowModal, createShowModal]);

  const handleConfirmDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/schemas/remove/schema/${id}`
      );
      setSchemaData(schemaData.filter((schema) => schema._id !== id));
      toast.success("Schema deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setDeleteShowModal(false);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/schemas/update/schema/${id}`,
        updatedData
      );
      setSchemaData(
        schemaData.map((schema) => (schema._id === id ? response.data : schema))
      );
      toast.success("Schema updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setEditShowModal(false); // Close the modal after updating
    }
  };

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 p-4 lg:grid-cols-3 lg:gap-8">
      <div className="h-32 rounded-lg lg:col-span-2">
        <div className=" rounded-lg bg-indigo-800 p-4 text-center text-3xl font-medium text-white">
          Schemas
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right ">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  Schema Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  Maximum Marks
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  Minimum Marks
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  Total Questions
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            {schemaData.map((data) => (
              <tbody
                className="divide-y divide-gray-200 text-center"
                key={data._id}
              >
                <tr>
                  <td className="whitespace-nowrap px-4 py-2 text-xl font-medium text-gray-700">
                    {data.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-xl font-medium text-gray-700">
                    {data.maxMarks}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-xl font-medium text-gray-700">
                    {data.minMarks}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-xl font-medium text-gray-700">
                    {data.totalQuestions}
                  </td>

                  {/* edit and delete */}
                  <td className="whitespace-nowrap px-4 py-2 ">
                    <div
                      className=" inline-block cursor-pointer rounded bg-indigo-600 px-4 py-2 
                    text-xs font-medium text-white hover:bg-indigo-700 "
                      onClick={() => {
                        setEditShowModal(!editShowModal);
                        setSelectedSchema(data);
                      }}
                    >
                      Edit
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <div
                      className="inline-block cursor-pointer rounded bg-red-600 px-4 py-2 
                    text-xs font-medium text-white hover:bg-indigo-700   "
                      onClick={() => {
                        setDeleteShowModal(!deleteShowModal);
                        handleConfirmDelete(data._id);
                      }}
                    >
                      Delete
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>

      {/* Right-aligned Create Schema Button */}
      <div className="flex items-start justify-end rounded-lg">
        <div
          className="hover:bg-transparent inline-block cursor-pointer items-center rounded border 
        border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium 
        text-white focus:outline-none focus:ring active:text-indigo-500"
          onClick={() => setCreateShowModal(!createShowModal)}
        >
          Create Schema
        </div>
      </div>

      <SchemaEditModal
        editShowModal={editShowModal}
        setEditShowModal={setEditShowModal}
        selectedSchema={selectedSchema}
        handleUpdate={handleUpdate}
        schemaData={schemaData}
        setSchemaData={setSchemaData}
      />

      <SchemaCreateModal
        setCreateShowModal={setCreateShowModal}
        createShowModal={createShowModal}
      />

      <SchemaDeleteModal
        deleteShowModal={deleteShowModal}
        setDeleteShowModal={setDeleteShowModal}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Schema;
