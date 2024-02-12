import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    todoName: {
      type: String,
      required: true,
      trim: true,
    },
    todoDesc: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
