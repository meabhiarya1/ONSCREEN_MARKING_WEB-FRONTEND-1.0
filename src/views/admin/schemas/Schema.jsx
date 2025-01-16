import React, { useEffect, useState } from "react";
import SchemaEditModal from "./SchemaEditModal";
import SchemaCreateModal from "./SchemaCreateModal";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmationModal from "components/modal/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

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

  const rows = schemaData.map((data, index) => ({
    id: data._id,
    name: data.name,
    maxMarks: data.maxMarks,
    minMarks: data.minMarks,
    totalQuestions: data.totalQuestions,
    compulsoryQuestions: data.compulsoryQuestions,
    evaluationTime: data.evaluationTime,
    numberOfPage: data.numberOfPage,
    hiddenPage: data.hiddenPage,
  }));

  const columns = [
    { field: "name", headerName: "Schema", flex: 1 },
    { field: "maxMarks", headerName: "Max Marks", flex: 1 },
    { field: "minMarks", headerName: "Min Marks", flex: 1 },
    { field: "totalQuestions", headerName: "Primary Qs", flex: 1 },
    { field: "compulsoryQuestions", headerName: "Compulsory Qs", flex: 1 },
    { field: "evaluationTime", headerName: "Eval Time", flex: 1 },
    { field: "numberOfPage", headerName: "No. of Pages Booklets", flex: 1 },
    { field: "hiddenPage", headerName: "Hidden Page", flex: 1 },

    {
      field: "createStructure",
      headerName: "Create Structure",
      flex: 1,
      renderCell: (params) => (
        <div
          className="cursor-pointer rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          onClick={() => {
            localStorage.removeItem("navigateFrom");
            navigate(`/admin/schema/create/structure/${params.row.id}`);
          }}
        >
          Create Structure
        </div>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => (
        <div
          className="cursor-pointer rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          onClick={() => {
            setEditShowModal(true);
            setSelectedSchema(params.row);
          }}
        >
          Edit
        </div>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <div
          className="cursor-pointer rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
          onClick={() => {
            setConfirmationModal(true);
            setSchemaId(params.row.id);
          }}
        >
          Delete
        </div>
      ),
    },
  ];

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

          <div style={{ maxHeight: "600px", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              sx={{
                "& .custom-header": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "extra-bold",
                },
              }}
            />
          </div>
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
