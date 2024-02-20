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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
