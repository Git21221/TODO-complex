import { createSlice } from "@reduxjs/toolkit";
import { getcurrentuser, refreshuser } from "../../APIs/backend.api";


let user;
const res = await getcurrentuser("GET");
if(!res.ok){
  const response = await refreshuser("GET");
  if(!response.ok) user = null;
}else user = await res.json();


const initialState = {
  user: user? user.data : null,
  isAuthenticated: user ? true : false,
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