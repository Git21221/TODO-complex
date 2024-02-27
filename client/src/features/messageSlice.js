import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMessage: false,
  message: null,
  type: null,
}

const messageSlice = createSlice({
  name: 'message',
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
    }
  }
});


export const {setSuccess, setError} = messageSlice.actions;
export default messageSlice.reducer