import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMessage: false,
  message: null,
  type: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setSuccess: (state, action) => {
      state.isMessage = action.payload.isMessage;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    setError: (state, action) => {
      state.isMessage = action.payload.isMessage;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    resetMessage: (state, action) => {
      state.isMessage = false;
      state.message = null;
      state.type = null;
    },
  },
});

export const { setSuccess, setError, resetMessage } = messageSlice.actions;
export default messageSlice.reducer;
