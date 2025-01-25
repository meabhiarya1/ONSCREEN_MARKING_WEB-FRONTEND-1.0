import React from "react";
import { useEffect, useState, useRef } from "react";
import { FaCloudUploadAlt, FaArrowAltCircleDown } from "react-icons/fa";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { getAllUsers } from "services/common";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";

import "../resultGenertion/ResultGeneration.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReactSelect from "react-select";

const ResultGeneration = () => {
  const [selectedCourseCode, setSelectedCourseCode] = useState(null); // Default value
  const [file, setFile] = useState({ name: "No file chosen" });
  const [disabled, setDisabled] = useState(true); // Start with disabled true
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for the file upload
  const [csvJsonData, setCsvJsonData] = useState([]);
  const [courseCode, setCourseCode] = useState([]);
  const [previousResults, setPreviousResults] = useState([]);
  const [newResult, setNewResult] = useState([]);
  const csvLinkRef = useRef(null);
  const token = localStorage.getItem("token");
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
    if (selectedCourseCode !== null) {
    }
    fetchCourseCode();
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const previousResults = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/resultgeneration/getpreviousresult?subjectcode=${selectedCourseCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setPreviousResults(response?.data?.results);
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      }
    };
    if (selectedCourseCode && newResult.length === 0) {
      previousResults();
    }
    // previousResults();
  }, [selectedCourseCode, token]);

  const CustomToolbar = () => (
    <GridToolbarContainer>
      {/* Include only the buttons you want */}
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      {/* <GridToolbarExport /> */}
      {/* Omit the export button */}
    </GridToolbarContainer>
  );

  // const handleChange = (event) => {
  //   const course_Code = event.target.value;
  //   setSelectedCourseCode(course_Code); // Update state with selected value
  //   // Enable button only if a valid role is selected
  //   setDisabled(course_Code === "null");
  // };

  const handleDownloadPreviousResult = async (fileName) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/resultgeneration/downloadresult?subjectcode=${selectedCourseCode}&filename=${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.result?.length > 0) {
        const csvData = response.data.result;
        // console.log(csvData)
        // Convert data to CSV
        const csvContent = convertToCSV(csvData);

        // Generate the file name
        const downloadFileName = `${fileName}_${selectedCourseCode}.csv`;

        // Trigger download
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(blob, downloadFileName);
      } else {
        toast.error("No data available to download");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error downloading result");
    }
  };
  // Utility function to convert JSON data to CSV
  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(","); // Extract headers
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`) // Add quotes to handle commas in data
          .join(",")
      )
      .join("\n");

    return `${headers}\n${rows}`;
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
        (item) => item?.COURSE_CODE !== selectedCourseCode
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

  const sendData = async (file) => {
    setLoading(true); // Start loading indicator
    const token = localStorage.getItem("token");

    // Create a FormData object
    const formData = new FormData();
    formData.append("csvFilePath", file); // The field name must match the backend
    formData.append("subjectcode", selectedCourseCode);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/resultgeneration/generate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set correct content type
          },
        }
      );
      return response; // Return the successful response
    } catch (error) {
      console.error("Error uploading file:", error);
      return error.response || error; // Return the error
    } finally {
      setLoading(false); // End loading indicator
      setFile({ name: "No file chosen" }); // Reset file selection
    }
  };

  const downloadFile = (data) => {
    if (data?.data?.length > 0) {
      // Convert data to CSV
      const csvContent = convertToCSV(data?.data);
      console.log(csvContent);
      setNewResult(data?.data);
      // Generate the file name
      const downloadFileName = `results_${selectedCourseCode}.csv`;

      // Trigger download
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, downloadFileName);
    } else {
      toast.error("No data available to download");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await sendData(file);
      if (response?.data?.message) {
        toast.error(response.data?.message);
        downloadFile(response?.data);
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
    } finally {
      setLoading(false); // End loading indicator
      setFile({ name: "No file chosen" }); // Reset file selection
      setSelectedCourseCode("Select Course Code");
      setCsvJsonData([]);
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
    { field: "SN", headerName: "SN", flex: 1 },
    { field: "BARCODE", headerName: "BARCODE", flex: 1 },
    { field: "COURSE_CODE", headerName: "COURSE_CODE", flex: 1 },
    { field: "ROLL_NO", headerName: "ROLL_NO", flex: 1 },
  ];

  const newResultrows = newResult?.map((data, index) => {
    return {
      id: index,
      SN: data?.SN,
      BARCODE: data?.BARCODE,
      COURSE_CODE: data?.COURSE_CODE,
      ROLL_NO: data?.ROLL_NO,
      MARKS: data?.MARKS,
      EVALUATEDBY: data?.EVALUATEDBY,
      AI_EVALUATION: "N/A",
    };
  });

  const newResultcolumns = [
    { field: "SN", headerName: "SN", flex: 1 },
    { field: "BARCODE", headerName: "BARCODE", flex: 1 },
    { field: "COURSE_CODE", headerName: "COURSE_CODE", flex: 1 },
    { field: "ROLL_NO", headerName: "ROLL_NO", flex: 1 },
    { field: "MARKS", headerName: "MARKS", flex: 1 },
    { field: "EVALUATEDBY", headerName: "EVALUATEDBY", flex: 1 },
    { field: "AI_EVALUATION", headerName: " AI_EVALUATION", flex: 1 },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#d1d5db", // Tailwind's gray-300
      backgroundColor: `${isDarkMode ? "#0b1437" : "#ffffff"}`, // Tailwind's gray-50 for light mode
      color: `${isDarkMode ? "#ffffff" : "#000000"}`, // White for dark mode, black for light mode
      borderRadius: "0.5rem", // Tailwind's rounded-lg
      padding: "0.25rem", // Adjust padding for a better look
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6366f1", // Tailwind's indigo-500
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#6366f1"
        : `${isDarkMode ? "#ffffff" : "#ffffff"}`, // Indigo-500 on hover, background color otherwise
      color: state.isFocused
        ? "#ffffff" // White text when focused
        : `${isDarkMode ? "#000000" : "#000000"}`, // Match input text color
      padding: "0.5rem",
    }),
    input: (provided) => ({
      ...provided,
      color: `${isDarkMode ? "#ffffff" : "#000000"}`, // Text color for input field
    }),
    singleValue: (provided) => ({
      ...provided,
      color: `${isDarkMode ? "#ffffff" : "#000000"}`, // Text color for the selected value
    }),
  };

  const options = courseCode?.map((course) => ({
    value: course?.code,
    label: `${course?.code} - ${course?.name}`,
  }));

  const handleChange = (selectedOption) => {
    const course_Code = selectedOption ? selectedOption?.value : "null";
    setSelectedCourseCode(course_Code); // Update state with selected value
    // Enable button only if a valid role is selected
    setDisabled(course_Code === "null");
  };

  return (
    <>
      <div className="">
        {newResult?.length === 0 && (
          <>
            <div className=" mt-12 grid grid-cols-1 gap-5 pb-4 sm:grid-cols-2 2xl:grid-cols-3">
              <article className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition duration-300 ease-in-out hover:border-indigo-500 hover:shadow-xl dark:bg-navy-700 dark:text-white">
                <div>
                  <h3 className="text-md mb-2 font-semibold text-gray-900 dark:text-white sm:text-xl">
                    Upload CSV File
                  </h3>
                  <p className="sm:text-md text-sm text-gray-700 dark:text-white">
                    Result Generation
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-evenly gap-1">
                  <div
                    className="sm:text-md group mt-4 inline-flex items-center rounded-lg bg-indigo-500 px-2 py-1.5 text-sm font-medium text-white transition-all hover:bg-indigo-600 lg:text-lg"
                    onClick={downloadSampleCsv}
                  >
                    <span>Download Sample</span>
                    <FaArrowAltCircleDown className="m-1 text-lg" />
                  </div>

                  <div className="mt-4 inline-flex items-center rounded-lg bg-indigo-500 px-2 py-1.5 text-white hover:bg-indigo-600">
                    <label
                      className="sm:text-md group inline-flex cursor-pointer items-center text-sm font-medium text-white transition-all lg:text-lg"
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
                      <FaCloudUploadAlt className="m-1 text-lg" />
                    </label>
                    <span className="sm:text-md max-w-xs sm:text-md lg:text-lg w-10 sm:w-18 text-sm text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                      {file?.name}
                    </span>
                  </div>
                </div>
              </article>

              {/* <div className="flex flex-col rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-lg transition duration-300 ease-in-out hover:border-indigo-500 hover:shadow-xl dark:bg-navy-700">
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
                  {/* show all course code }

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
                  {loading ? "Genrating..." : "Generate Result"}
                </div>
              </div> */}

              <div className="flex flex-col rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-lg transition duration-300 ease-in-out hover:border-indigo-500 hover:shadow-xl dark:bg-navy-700">
                <label
                  htmlFor="selectCourseCode"
                  className="sm:text-md text-sm font-medium text-gray-700 dark:text-white lg:text-lg"
                >
                  Select Course Code
                </label>

                <ReactSelect
                  id="selectCourseCode"
                  value={
                    options?.find(
                      (option) => option?.value === selectedCourseCode
                    ) || null
                  }
                  onChange={handleChange}
                  options={options}
                  isClearable
                  placeholder="Search or select a course..."
                  styles={customStyles}
                  className="sm:text-md mt-2 text-sm lg:text-lg"
                />

                <div
                  className="sm:text-md mt-3 cursor-pointer rounded bg-indigo-600 p-2 text-center text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring active:text-indigo-500 sm:px-4 sm:py-2 lg:text-lg"
                  onClick={handleSubmit}
                >
                  {loading ? "Generating..." : "Generate Result"}
                </div>
              </div>

              <div className="flex flex-col rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-lg transition duration-300 ease-in-out hover:border-indigo-500 hover:shadow-xl dark:bg-navy-700">
                <label
                  htmlFor="previousResultsrelatedtoCourseCode"
                  className="sm:text-md text-sm font-medium text-gray-700 dark:text-white lg:text-lg"
                >
                  Previous Results
                </label>

                {previousResults?.length > 0 ? (
                  <div className="mt-1 space-y-2">
                    {previousResults?.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 shadow-md dark:bg-navy-900"
                      >
                        <p className="text-lg font-medium text-gray-800 dark:text-white">
                          {result?.filename}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-white">
                          {new Date(result?.time).toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div
                          class="group relative"
                          onClick={() =>
                            handleDownloadPreviousResult(result?.filename)
                          }
                        >
                          <button class="flex h-8 w-8 items-center justify-center rounded-lg bg-white hover:translate-y-1 hover:text-blue-600 hover:duration-300 dark:bg-navy-700 dark:text-white">
                            <svg
                              class="h-6 w-6"
                              stroke="currentColor"
                              stroke-width="1.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-300">
                    No results found
                  </p>
                )}
              </div>

              <a
                ref={csvLinkRef}
                style={{ display: "none" }}
                download="sample.csv"
              />
            </div>

            <div style={{ width: "100%" }} className="dark:bg-navy-700">
              {isDarkMode ? (
                <ThemeProvider theme={darkTheme}>
                  <DataGrid
                    className="dark:bg-navy-700"
                    rows={rows}
                    columns={columns}
                    slots={{ toolbar: CustomToolbar }} // Use your custom toolbar
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
                    style={{ maxHeight: "450px" }}
                    pageSize={5}
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
                    slots={{ toolbar: CustomToolbar }} // Use your custom toolbar
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
                    style={{ maxHeight: "450px" }}
                    pageSize={5}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {newResult?.length > 0 && (
          <div className="mt-12 flex flex-col">
            {" "}
            <div className="flex justify-end gap-5">
            <button
                className="button flex justify-center items-center"
                type="submit"
              >
                <svg
                  viewBox="0 0 576 512"
                  class="svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
                    fill="#74C0FC"
                  ></path>
                </svg>
                Generate by AI
              </button>
              <button
                class="button"
                type="submit"
                className="mr-5 flex w-40 items-center justify-center gap-2 rounded-md bg-indigo-500 p-2 text-lg text-white hover:bg-indigo-600 button1"
                onClick={() => {
                  setNewResult([]);
                  setPreviousResults([]);
                }}
              >
                <svg
                  viewBox="0 0 576 512"
                  class="svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
                    fill="#74C0FC"
                  ></path>
                </svg>
                Generate Result
              </button>
            </div>
            <div
              style={{ maxHeight: "600px", width: "100%", marginTop: "20px" }}
              className="dark:bg-navy-700"
            >
              {isDarkMode ? (
                <ThemeProvider theme={darkTheme}>
                  <DataGrid
                    className="dark:bg-navy-700"
                    rows={newResultrows}
                    columns={newResultcolumns}
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
                    style={{ maxHeight: "500px" }}
                    pageSize={5}
                  />
                </ThemeProvider>
              ) : (
                <div
                  style={{ maxHeight: "600px", width: "100%" }}
                  className="dark:bg-navy-700"
                >
                  <DataGrid
                    rows={newResultrows}
                    columns={newResultcolumns}
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
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultGeneration;
