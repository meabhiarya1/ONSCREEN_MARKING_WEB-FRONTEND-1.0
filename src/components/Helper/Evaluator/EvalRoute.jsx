import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const getAllEvaluatorTasks = async () => {
  const token = localStorage.getItem("token");
  const userInfo = jwtDecode(token);
  const userID = userInfo.userId;
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/tasks/getall/tasks/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const getTaskById = async (taskId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/tasks/get/task/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};
