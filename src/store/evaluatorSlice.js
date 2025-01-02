import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  iconSelected: null,
  currentIndex: 1,
  currentQuestion: 1,
  baseImageUrl: "",
  currentIcon: null,
  isDraggingIcon: false,
  currentIconMark: null,
  currentMarkDetails: null,
  currentTaskDetails: null,
  currentBookletIndex: null,
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
      const index = action.payload;
      state.currentQuestion = index;
    },
    setBaseImageUrl: (state, action) => {
      const extractedImagesFolder = action.payload;

      state.baseImageUrl = extractedImagesFolder;
    },
    setCurrentIcon: (state, action) => {
      const icon = action.payload;
      state.currentIcon = icon;
    },
    setIsDraggingIcon: (state, action) => {
      state.isDraggingIcon = action.payload;
    },
    setCurrentIconMark: (state, action) => {
      state.currentIconMark = action.payload;
    },
    setCurrentMarkDetails: (state, action) => {
      state.currentMarkDetails = action.payload;
    },
    setCurrentTaskDetails: (state, action) => {
      state.currentTaskDetails = action.payload;
    },
    setCurrentBookletIndex: (state, action) => {
      state.currentBookletIndex = action.payload;
    },
  },
});

export const {
  login,
  logout,
  rehydrateToken,
  setIndex,
  setBaseImageUrl,
  setCurrentIcon,
  setIsDraggingIcon,
  setCurrentIconMark,
  setCurrentQuestion,
  setCurrentMarkDetails,
  setCurrentTaskDetails,
  setCurrentBookletIndex,
} = evaluatorSlice.actions;
export default evaluatorSlice.reducer;
