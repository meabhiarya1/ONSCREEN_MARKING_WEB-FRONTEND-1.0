import axios from "axios";

export const getUserDetails = async (token) => {
  const id = localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/${id}`,
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

export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth`,
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

export const createUser = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/signup`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};
