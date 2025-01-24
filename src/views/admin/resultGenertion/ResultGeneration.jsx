import React from "react";
import { useEffect, useState, useRef } from "react";
import { FaCloudUploadAlt, FaArrowAltCircleDown } from "react-icons/fa";
import Papa from "papaparse";
import routes from "routes";
import { toast } from "react-toastify";
import { getAllUsers } from "services/common";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { MdAutoDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const ResultGeneration = () => {
  const [selectedCourseCode, setSelectedCourseCode] = useState(null); // Default value
  const [file, setFile] = useState({ name: "No file chosen" });
  const [disabled, setDisabled] = useState(true); // Start with disabled true
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for the file upload
  const [csvJsonData, setCsvJsonData] = useState([]);
  const [courseCode, setCourseCode] = useState([]);
  const csvLinkRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response); // Assuming 'response' contains an array of user objects with 'email' field
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchCourseCode = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/get/subjectswithtasks`
        );
        // console.log(response?.data?.subjects);
        setCourseCode(response?.data?.subjects);
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      }
    };
    fetchCourseCode();
  }, [token]);

  const handleChange = (event) => {
    const course_Code = event.target.value;
    setSelectedCourseCode(course_Code); // Update state with selected value
    // Enable button only if a valid role is selected
    setDisabled(course_Code === "null");
  };

  const downloadSampleCsv = () => {
    // Define the CSV headings
    const csvHeadings = ["SN", "BARCODE", "ROLL_NO", "COURSE_CODE"];

    // Convert the headings to CSV format (comma-separated and new line at the end)
    const csvContent = csvHeadings.join(",") + "\n";

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    csvLinkRef.current.href = URL.createObjectURL(blob);
    csvLinkRef.current.click(); // Trigger the download
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (result) {
          resolve(result.data);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  };

  const uploadHandle = async (e) => {
    if (!selectedCourseCode || selectedCourseCode === "null") {
      toast.warning("Please select a Course Code");
      return;
    }

    try {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      if (!selectedFile) {
        setDisabled(false);
        return;
      }

      const jsonData = await parseCSV(selectedFile);

      const CourseCodeNotMatched = jsonData?.filter(
        (item) => item.COURSE_CODE !== selectedCourseCode
      );

      if (CourseCodeNotMatched?.length > 0) {
        toast.error("Course Code Not Matched in CSV File Please Try Again");
        return;
      }

      setCsvJsonData(jsonData);
    } catch (error) {
      toast.error("Error processing the file");
    }
  };

  const sendData = async (data) => {
    setLoading(true); // Start loading indicator
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/createuserbycsv`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    } finally {
      setLoading(false); // End loading indicator
      // setSelectedRole(null);
      setFile({ name: "No file chosen" });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await sendData(csvJsonData);
      if (response?.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.warning("Unexpected response format");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const rows = csvJsonData?.map((data, index) => {
    return {
      id: index,
      SN: data?.SN,
      BARCODE: data?.BARCODE,
      COURSE_CODE: data?.COURSE_CODE,
      ROLL_NO: data?.ROLL_NO,
    };
  });

  const columns = [
    { field: "SN", headerName: " SN.", flex: 1 },
    { field: "BARCODE", headerName: "BARCODE", flex: 1 },
    { field: "COURSE_CODE", headerName: "COURSE_CODE", flex: 1 },
    { field: "ROLL_NO", headerName: "ROLL_NO", flex: 1 },
  ];

  return (
    <div className="">
      <div className=" mt-5 grid grid-cols-1 gap-5 py-4 sm:grid-cols-2 2xl:grid-cols-3">
        <article className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition duration-300 ease-in-out hover:border-indigo-500 hover:shadow-xl dark:bg-navy-700 dark:text-white">
          <div>
            <h3 className="text-md mb-2 font-semibold text-gray-900 dark:text-white sm:text-xl">
              Upload CSV File
            </h3>
            <p className="sm:text-md text-sm text-gray-700 dark:text-white">
              Result Generation
            </p>
          </div>

          <div className="flex items-center justify-between sm:mt-2">
            <div
              className="sm:text-md group mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-all hover:text-blue-700 dark:text-navy-200 dark:hover:text-navy-300 lg:text-lg"
              onClick={downloadSampleCsv}
            >
              <span>Download Sample</span>
              <FaArrowAltCircleDown className="m-1 text-lg" />
            </div>

            <div className="mt-4 inline-flex items-center gap-2">
              <label
                className="sm:text-md group inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 transition-all hover:text-blue-700 dark:text-navy-200 dark:hover:text-navy-300 lg:text-lg"
                htmlFor="uploadCSV"
                onClick={(e) => {
                  if (disabled) {
                    e.preventDefault(); // Prevent the label from triggering the file input
                    toast.warning("Please select a Course Code");
                  }
                }}
              >
                Upload CSV
                <input
                  id="uploadCSV"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={uploadHandle}
                />
                <FaCloudUploadAlt className="m-1 text-2xl" />
              </label>
              <span className="sm:text-md max-w-xs overflow-hidden text-ellipsis text-sm lg:text-lg">
                {file?.name}
              </span>
            </div>
          </div>

          {loading && <div className="mt-4 text-blue-600">Uploading...</div>}
        </article>

        <div className="flex flex-col rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-lg transition duration-300 ease-in-out hover:border-indigo-500 hover:shadow-xl dark:bg-navy-700">
          <label
            htmlFor="SelectCourseCode"
            className="sm:text-md text-sm font-medium text-gray-700 dark:text-white lg:text-lg"
          >
            Select Course Code
          </label>
          <select
            id="selectCourseCode"
            value={selectedCourseCode}
            onChange={handleChange}
            className="sm:text-md rounded-lg border border-gray-300 p-1 text-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white sm:p-3 lg:text-lg"
          >
            <option value="null">Select Course Code</option>
            {/* show all course code */}

            {courseCode?.map((course) => (
              <option value={course?.code}>
                {course?.code} - {course?.name}
              </option>
            ))}
          </select>

          <div
            className="sm:text-md mt-3 cursor-pointer rounded bg-indigo-600 p-2 text-center text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring active:text-indigo-500 sm:px-4 sm:py-2 lg:text-lg"
            onClick={handleSubmit}
          >
            Generate Result
          </div>
        </div>

        <a ref={csvLinkRef} style={{ display: "none" }} download="sample.csv" />
      </div>

      <div style={{ width: "100%" }} className="dark:bg-navy-700">
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
          style={{ maxHeight: "500px" }}
          pageSize={5}
        />
      </div>

      {/* <div
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
      </div> */}
    </div>
  );
};

export default ResultGeneration;
