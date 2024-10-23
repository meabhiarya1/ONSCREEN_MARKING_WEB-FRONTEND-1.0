import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
};

const evaluatorSlice = createSlice({
  name: "evaluator",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, userId } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
    rehydrateToken: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
      }
    },
  },
});

export const { login, logout, rehydrateToken } = evaluatorSlice.actions;
export default evaluatorSlice.reducer;
