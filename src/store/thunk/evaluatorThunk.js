import { createAsyncThunk } from "@reduxjs/toolkit";
import { postMarkById } from "components/Helper/Evaluator/EvalRoute";

export const fetchEvaluatorData = createAsyncThunk(
  "evaluator/fetchEvaluatorData",
  async (body, { rejectWithValue }) => {
    try {
      // Make the API call
      const response = await postMarkById(body);

      return response;
    } catch (error) {
      // Handle errors by rejecting with a value
      return rejectWithValue(error.message);
    }
  }
);
