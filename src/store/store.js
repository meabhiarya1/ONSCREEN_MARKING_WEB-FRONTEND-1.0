import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import evaluatorSlice from "./evaluatorSlice"

const store = configureStore({
  reducer: {
    auth: authSlice,
    evaluator : evaluatorSlice
  },
});

export default store;
                                                   