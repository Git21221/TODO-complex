import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from "../../persist/authPersist";
import Cookies from "js-cookie";
import { refreshuser } from "../../APIs/backend.api";

let { user, isAuthenticated } = getAuth();
const accessToken = Cookies.get("accessToken");
const refreshToken = Cookies.get("refreshToken");

console.log(user, isAuthenticated);

if (!accessToken) {
  (async () => {
    await refreshuser();
  })();
}
if(!refreshToken){
  user = {}, isAuthenticated= false;
}
const initialState = {
  user,
  isAuthenticated,
};

console.log(initialState);

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
