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
    return response.data;
  } catch (error) {
    console.log(error);
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
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
