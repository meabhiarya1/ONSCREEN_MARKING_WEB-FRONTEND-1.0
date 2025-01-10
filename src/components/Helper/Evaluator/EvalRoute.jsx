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

export const getAnswerPdfById = async (answerPdfId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/evaluation/answerimages/getall/answerpdfimage/${answerPdfId}`,
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
export const getQuestionSchemaById = async (taskId, answerPdfId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/tasks/get/questiondefinition?answerPdfId=${answerPdfId}&taskId=${taskId}`,
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
export const updateAnswerPdfById = async (answerPdfId, status) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/evaluation/answerimages/update/answerpdfimage/${answerPdfId}`,
      { status: status },
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

export const postMarkById = async (body) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/evaluation/marks/create`,
      body,
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

export const changeCurrentIndexById = async (id, nextIndex) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/tasks/update/task/currentIndex/${id}`,
      { currentIndex: nextIndex },
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

export const createIcon = async (body) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/evaluation/icons/create`,
      { ...body },
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

export const getIconsByImageId = async (
  questionDefinitionId,
  answerPdfImageId
) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/evaluation/icons/geticons?questionDefinitionId=${answerPdfImageId}&answerPdfImageId=${questionDefinitionId}
      `,
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

export const deleteIconByImageId = async (iconId, answerPdfId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/evaluation/icons/remove?iconsId=${iconId}&answerPdfId=${answerPdfId}
      `,
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
// /api/evaluation/icons/removeall

export const getSubjectIdImgUrl = async (
  subjectRelationId,
  questionDefinitionId
) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/subjects/relations/getallcoordinatesandschemarelationdetails?subjectRelationId=${subjectRelationId}&questionDefinitionId=${questionDefinitionId}
      `,

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
