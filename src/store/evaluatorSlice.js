import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  iconSelected: null,
  currentIndex: 1,
  currentQuestion: 1,
};

const evaluatorSlice = createSlice({
  name: "evaluator",
  initialState,
  reducers: {
    selectIcon: (state, action) => {
      const { selectedIcon } = action.payload;
      state.iconSelected = selectedIcon;
    },

    setIndex: (state, action) => {
      const { index } = action.payload;
      state.currentIndex = index;
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
    setCurrentQuestion: (state, action) => {
      const { index } = action.payload;
      state.currentQuestion = index;
    },
  },
});

export const { login, logout, rehydrateToken, setIndex } =
  evaluatorSlice.actions;
export default evaluatorSlice.reducer;
