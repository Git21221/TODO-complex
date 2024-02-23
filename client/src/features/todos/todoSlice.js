import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todo: [],
  isChanged: false
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodo: (state, action) => {
      state.todo = action.payload.todo;
      state.isChanged = action.payload.isChanged;
    },
  },
});

export const { setTodo, isChanged } = todoSlice.actions;
export default todoSlice.reducer;
