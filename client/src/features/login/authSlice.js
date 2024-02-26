import { createSlice } from "@reduxjs/toolkit";
import { getAuth, removeAuth } from "../../persist/authPersist";
// import Cookies from "js-cookie";
import { refreshuser } from "../../APIs/backend.api";

let { user, isAuthenticated } = getAuth();

const initialState = {
  user,
  isAuthenticated,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
