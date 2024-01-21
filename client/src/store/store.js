import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/login/authSlice.js";
import todoSlice from "../features/todos/todoSlice.js";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  serialize: true,
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  todo: todoSlice,
});

export const store = configureStore({reducer: rootReducer});

export const persistor = persistStore(store);
