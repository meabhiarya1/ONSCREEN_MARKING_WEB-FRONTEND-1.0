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
  rerender: false,
  currentAnswerPdfImageId: null,
  currentQuestionDefinitionId: null,
  currentAnswerPdfId: null,
  icons: [],
  isLoading: false,
  currentBookletId:null,
  imageObj : null
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
    setRerender: (state) => {
      state.rerender = !state.rerender;
    },
    setCurrentBookletId: (state, action) => {
      state.currentBookletId = action.payload;
    },
    setCurrentAnswerPdfImageId: (state, action) => {
      state.currentAnswerPdfImageId = action.payload;
    },
    setCurrentQuestionDefinitionId: (state, action) => {
      state.currentQuestionDefinitionId = action.payload;
    },
    setCurrentAnswerPdfId: (state, action) => {
      state.currentAnswerPdfId = action.payload;
    },
    setIcons: (state, action) => {
      state.icons = action.payload;
    },
    setIsLoadingTrue: (state) => {
      state.isLoading =true;
    },
    setIsLoadingFalse: (state) => {
      state.isLoading =false;
    },
    setImageObj: (state, action) => {
      state.imageObj = action.payload;
    },
  },
});

export const {
  login,
  logout,
  rehydrateToken,
  setIndex,
  setRerender,
  setBaseImageUrl,
  setCurrentIcon,
  setIsDraggingIcon,
  setCurrentIconMark,
  setCurrentQuestion,
  setCurrentMarkDetails,
  setCurrentTaskDetails,
  setCurrentBookletIndex,
  setCurrentAnswerPdfImageId,
  setCurrentQuestionDefinitionId,
  setCurrentAnswerPdfId,
  setIcons,
  setIsLoadingTrue,
  setIsLoadingFalse,
  setCurrentBookletId,
  setImageObj
} = evaluatorSlice.actions;
export default evaluatorSlice.reducer;
