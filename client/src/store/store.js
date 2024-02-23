import { combineReducers, configureStore } from "@reduxjs/toolkit";
import todoSlice from "../features/todos/todoSlice.js";
import authSlice from "../features/login/authSlice.js";

const rootReducer = combineReducers({
  auth: authSlice,
  todo: todoSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});