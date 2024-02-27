import { combineReducers, configureStore } from "@reduxjs/toolkit";
import todoSlice from "../features/todos/todoSlice.js";
import authSlice from "../features/login/authSlice.js";
import loadingSlice from "../features/loadingSlice.js";
import messageSlice from "../features/messageSlice.js";

const rootReducer = combineReducers({
  auth: authSlice,
  todo: todoSlice,
  load: loadingSlice,
  message: messageSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});