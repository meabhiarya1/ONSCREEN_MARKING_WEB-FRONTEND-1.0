import { getAllEvaluatorTasks } from "components/Helper/Evaluator/EvalRoute";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const columns = [
  { id: "slno", label: "Sl No" },

  { id: "subjectCode", label: "Subject Code" },
  { id: "totalBooklets", label: "Total Booklets" },
  {
    id: "status",
    label: "Status",

    format: (value) => (value !== "active" ? "Not Started" : "Started"),
  },

  { id: "action", label: "Action" },
];
const Dashboard = () => {
  const [allTasks, setAllTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllEvaluatorTasks();
        if (response?.data) {
          if (Array.isArray(response?.data)) {
            setAllTasks(response.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {});
  const handleStartTask = (rowData) => {
    console.log(rowData._id);
    navigate(`/evaluator/task/${rowData._id}`);
  };
  console.log(allTasks);
  const AssignedTasks = allTasks.map((row, index) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
      {columns.map((column) => {
        let value;

        // Handle the Sl No column
        if (column.id === "slno") {
          value = index + 1;
        } else {
          value = row[column.id];
        }
        if (column.id === "action") {
          return (
            <TableCell key={column.id} align={column.align}>
              <button
                onClick={() => handleStartTask(row)}
                // data-hidden-value={row}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Start Task
              </button>
            </TableCell>
          );
        }
        return (
          <TableCell key={column.id} align={column.align}>
            {column.format && typeof value !== "undefined"
              ? column.format(value)
              : value}
          </TableCell>
        );
      })}
    </TableRow>
  ));

  return (
    <>
      <div className=" w-full justify-center rounded-lg border border-gray-200 bg-white p-4 text-center shadow dark:border-gray-700 dark:bg-gray-800 sm:p-8 ">
        <h5 className=" mb-10 text-3xl font-bold text-gray-900 dark:text-white">
          Allocated Tasks
        </h5>
        <p className="mb-5 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
          Click Below to start evaluating the papers.
        </p>
        {/* <div>
          <div className="mx-auto mb-10 w-1/2 rounded-lg border-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                CHE 216: Engineering Mathematics - III
              </p>
              <a
                onClick={evalHandler}
                className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
              >
                <svg
                  className="me-3 h-7 w-7"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google-play"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"
                  ></path>
                </svg>
                <div className="text-left rtl:text-right">
                  <div className="mb-1 text-xs">Start</div>
                  <div className="-mt-1 font-sans text-sm font-semibold">
                    Start Evaluating
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="mx-auto mb-10 w-1/2 rounded-lg border-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                CHE 212: Organic Chemistry
              </p>
              <button
                onClick={evalHandler}
                className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
              >
                <svg
                  className="me-3 h-7 w-7"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google-play"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"
                  ></path>
                </svg>
                <div className="text-left rtl:text-right">
                  <div className="mb-1 text-xs">Start</div>
                  <div className="-mt-1 font-sans text-sm font-semibold">
                    Start Evaluating
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div> */}

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "Roboto, Arial, sans-serif",
                        fontSize: "16px",
                      }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>{AssignedTasks}</TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <div className="items-center justify-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0 rtl:space-x-reverse">
          {/* <a
            href="#"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 sm:w-auto"
          >
            <svg
              className="me-3 h-7 w-7"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="apple"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
              ></path>
            </svg>
            <div className="text-left rtl:text-right">
              <div className="mb-1 text-xs">Download on the</div>
              <div className="-mt-1 font-sans text-sm font-semibold">
                Mac App Store
              </div>
            </div>
          </a> */}
          {/* <a
            href="#"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 sm:w-auto"
          >
            <svg
              className="me-3 h-7 w-7"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google-play"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"
              ></path>
            </svg>
            <div className="text-left rtl:text-right">
              <div className="mb-1 text-xs">Start</div>
              <div className="-mt-1 font-sans text-sm font-semibold">
                Start Evaluating
              </div>
            </div>
          </a> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
