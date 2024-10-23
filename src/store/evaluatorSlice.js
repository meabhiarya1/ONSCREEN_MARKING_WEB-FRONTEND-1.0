import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  iconSelected: null,
};

const evaluatorSlice = createSlice({
  name: "evaluator",
  initialState,
  reducers: {
    selectIcon: (state, action) => {    
      const { selectedIcon } = action.payload;
      state.iconSelected = selectedIcon;
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
