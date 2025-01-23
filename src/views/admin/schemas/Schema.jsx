import React, { useEffect, useState } from "react";
import SchemaEditModal from "./SchemaEditModal";
import SchemaCreateModal from "./SchemaCreateModal";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmationModal from "components/modal/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { MdCreateNewFolder } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdAutoDelete } from "react-icons/md";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Schema = () => {
  const [editShowModal, setEditShowModal] = useState(false);
  const [createShowModal, setCreateShowModal] = useState(false);
  const [schemaData, setSchemaData] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [schemaId, setSchemaId] = useState();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the `dark` mode is applied to the `html` element
    const htmlElement = document.body; // `html` element
    const checkDarkMode = () => {
      const isDark = htmlElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Optionally, observe for changes if the theme might toggle dynamically
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark", // Use 'light' for light mode
      background: {
        default: "#111c44", // Background for dark mode
      },
      text: {
        primary: "#ffffff", // White text for dark mode
      },
    },
  });

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
    hiddenPage: data?.hiddenPage.map((item) => parseInt(item) + 1),
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
      renderCell: (params) => (
        <div
          className="flex cursor-pointer justify-center rounded px-3 py-2 text-center font-medium text-yellow-600 "
          onClick={() => {
            localStorage.removeItem("navigateFrom");
            navigate(`/admin/schema/create/structure/${params.row.id}`);
          }}
        >
          <MdCreateNewFolder className="size-8  " />
        </div>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",

      renderCell: (params) => (
        <div
          className="mt-1 flex cursor-pointer justify-center rounded px-3 py-2 text-center font-medium text-indigo-400"
          onClick={() => {
            setEditShowModal(true);
            setSelectedSchema(params.row);
          }}
        >
          <FiEdit className="size-6" />
        </div>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",

      renderCell: (params) => (
        <div
          className="mt-1 flex cursor-pointer justify-center rounded px-3 py-2 text-center font-medium text-red-600"
          onClick={() => {
            setConfirmationModal(true);
            setSchemaId(params.row.id);
          }}
        >
          <MdAutoDelete className="size-6" />
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

          {isDarkMode ? (
            <ThemeProvider theme={darkTheme}>
              <DataGrid
                className="dark:bg-navy-700"
                rows={rows}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    fontWeight: 900,
                    fontSize: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Header background for dark mode
                    color: "#ffffff", // Force header text to white
                  },
                  "& .MuiDataGrid-cell": {
                    fontSize: "0.80rem",
                    color: "#ffffff", // Force cell text to white
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Hover effect for dark mode
                  },
                  "& .MuiTablePagination-root": {
                    color: "#ffffff", // Pagination text color
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: "#111c44", // Footer background for dark mode
                    color: "#ffffff", // Footer text color
                  },
                  "& .MuiDataGrid-toolbarContainer button": {
                    color: "#ffffff", // Toolbar button color
                  },
                  "& .MuiDataGrid-toolbarContainer svg": {
                    fill: "#ffffff", // Toolbar icon color
                  },
                }}
              />
            </ThemeProvider>
          ) : (
            <div
              style={{ maxHeight: "600px", width: "100%" }}
              className="dark:bg-navy-700"
            >
              <DataGrid
                rows={rows}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    fontWeight: 900,
                    fontSize: "1rem",
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                  },
                  "& .MuiTablePagination-root": {
                    color: "#000000", // Text color for pagination controls
                  },
                  "& .MuiDataGrid-cell": {
                    fontSize: "0.80rem", // Smaller row text
                    color: "#000000", // Cell text color in dark mode
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional hover effect in dark mode
                  },
                }}
              />
            </div>
          )}
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
