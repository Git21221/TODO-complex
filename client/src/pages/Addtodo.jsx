import React, { useState, useEffect } from "react";
import { Input } from "../components/index.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { removeAuth } from "../persist/authPersist.js";
import "./handleCss.css";
import { addtodo } from "../APIs/backend.api.js";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/login/authSlice.js";
import { setError, setSuccess } from "../features/messageSlice.js";
import { useForm } from "react-hook-form";

function Addtodo() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [todoName, setTodo] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    control,
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await addtodo(data, "POST");
      if (res.ok) {
        dispatch(
          setSuccess({
            isMessage: true,
            message: "Todo added successfully",
            type: "success",
          })
        );
        navigate("/allTodos");
      } else {
        dispatch(
          setError({
            isMessage: true,
            message: "Something went wrong!",
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        setError({
          isMessage: true,
          message: "Something went wrong!",
          type: "error",
        })
      );
    }
  };

  if (isAuthenticated) {
    return (
      <div className="h-screen max-w-[450px] flex items-center justify-center bg-zinc-950 flex-col gap-8 text-white m-auto">
        <Helmet>
          <title>Add Todo | TODO</title>
        </Helmet>
        <div className="form bg-neutral-800 border border-neutral-600 lg:p-10 md:p-5 p-5 rounded-2xl w-full flex flex-col items-center justify-center gap-6 mx-5">
          <h1 className="text-3xl font-bold">Add your Todo</h1>

          <form
            method="post"
            className="flex flex-col gap-6 w-full"
            onSubmit={handleSubmit(submitHandler)}
          >
            <Input
              title="Todo Name"
              name="todoName"
              type="text"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
              watch={watch}
              control={control}
              trigger={trigger}
            />
            <Input
              title="Todo Description"
              name="todoDesc"
              type="text"
              register={register}
              errors={errors}
              validation={{
                required: true,
              }}
              watch={watch}
              control={control}
              trigger={trigger}
            />
            <button
            type="submit"
              className="bg-zinc-100 rounded-3xl px-3 py-2 bg-opacity-30 text-black hover:bg-zinc-50 transition-all font-bold"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="pt-16 h-screen flex items-center justify-center">
      <Helmet>
        <title>Home | TODO</title>
      </Helmet>
      <p className="font-extrabold text-7xl p-3">signup ba login kor</p>
    </div>
  );
}

export default Addtodo;
