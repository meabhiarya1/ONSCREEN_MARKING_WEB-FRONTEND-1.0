import React, { useEffect, useState } from "react";
import SchemaEditModal from "./SchemaEditModal";
import SchemaCreateModal from "./SchemaCreateModal";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmationModal from "components/modal/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const Schema = () => {
  const [editShowModal, setEditShowModal] = useState(false);
  const [createShowModal, setCreateShowModal] = useState(false);
  const [schemaData, setSchemaData] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [schemaId, setSchemaId] = useState();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }
    const fetchSchemaData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/schemas/getall/schema`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSchemaData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSchemaData();
  }, [setCreateShowModal, createShowModal, navigate, token]);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/schemas/remove/schema/${schemaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchemaData(schemaData.filter((schema) => schema._id !== schemaId));
      toast.success("Schema deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setConfirmationModal(false);
      setSchemaId("");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/schemas/update/schema/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchemaData(
        schemaData.map((schema) => (schema._id === id ? response.data : schema))
      );
      toast.success("Schema updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      // setEditShowModal(false); // Close the modal after updating
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 p-4 lg:grid-cols-3 lg:gap-8">
      <div className="h-32 rounded-lg lg:col-span-3">
        <div className=" overflow-x-auto rounded-lg">
          <div className="mb-4 flex items-start justify-start rounded-lg sm:justify-end">
            <div
              className="hover:bg-transparent inline-block cursor-pointer items-center rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
              onClick={() => setCreateShowModal(!createShowModal)}
            >
              Create Schema
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 rounded-md bg-white text-sm dark:divide-gray-700 dark:bg-navy-700">
            <thead className="ltr:text-left rtl:text-right bg-gray-100 dark:bg-navy-800">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  Schema
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  Max Marks
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  Min Marks
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  Primary Qs
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  Compulsory Qs
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  Eval Time
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 dark:text-white">
                  
                </th>
              </tr>
            </thead>

            {schemaData.map((data) => (
              <tbody
                className="divide-y divide-gray-200 text-center"
                key={data._id}
              >
                <tr>
                  <td className="text-md whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {data.name}
                  </td>
                  <td className="text-md whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {data.maxMarks}
                  </td>
                  <td className="text-md whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {data.minMarks}
                  </td>
                  <td className="text-md whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {data.totalQuestions}
                  </td>
                  <td className="text-md whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {data.compulsoryQuestions}
                  </td>

                  <td className="text-md whitespace-nowrap px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {data.evaluationTime}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 ">
                    <div
                      className=" inline-block cursor-pointer rounded bg-indigo-600 px-3 py-2 
                    text-xs font-medium text-white hover:bg-indigo-700 "
                      onClick={() => {
                        localStorage.removeItem("navigateFrom");
                        navigate(`/admin/schema/create/structure/${data._id}`);
                      }}
                    >
                      Create Structure
                    </div>
                  </td>

                  {/* edit and delete */}
                  <td className="whitespace-nowrap px-3 py-2  ">
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
                  <td className="whitespace-nowrap px-3 py-2 ">
                    <div
                      className="inline-block cursor-pointer rounded bg-red-600 px-4 py-2 
                    text-xs font-medium text-white hover:bg-red-700   "
                      onClick={() => {
                        setConfirmationModal(true);
                        setSchemaId(data._id);
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

      <ConfirmationModal
        confirmationModal={confirmationModal}
        onSubmitHandler={handleConfirmDelete}
        setConfirmationModal={setConfirmationModal}
        setId={setSchemaId}
        heading="Confirm Schema Removal"
        message="Are you sure you want to remove this schema? This action cannot be undone."
        type="error" // Options: 'success', 'warning', 'error'
      />
    </div>
  );
};

export default Schema;
