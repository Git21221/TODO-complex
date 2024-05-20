import React, { useState } from "react";
import { Input } from "../components/index.js";
import { useNavigate } from "react-router-dom";
import { registerData } from "../APIs/backend.api.js";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../features/messageSlice.js";
import { setLoading } from "../features/loadingSlice.js";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    control,
  } = useForm();

  const submitHandler = async (data) => {
    console.log(data);
    dispatch(setLoading({ isLoading: true }));
    try {
      const res = await registerData(data, "POST");
      const userData = await res.json();

      if (res.ok) {
        dispatch(setLoading({ isLoading: false }));
        dispatch(
          setSuccess({
            isMessage: true,
            message: userData.message,
            type: "success",
          })
        );
        navigate("/login");
      } else {
        dispatch(setLoading({ isLoading: false }));
        dispatch(
          setError({
            isMessage: true,
            message: userData.message,
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

  return (
    <div className="h-screen max-w-[450px] flex items-center justify-center flex-col gap-8 text-white m-auto">
      <div className="form bg-neutral-800 border border-neutral-600 lg:p-10 md:p-5 p-5 rounded-2xl w-full flex flex-col items-center justify-center gap-6 mx-5">
        <h1 className="text-3xl font-bold">Register yourself</h1>
        <form
          method="post"
          className="flex flex-col gap-6 w-full"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Input
            title={"Full Name"}
            name="fullName"
            type="text"
            register={register}
            watch={watch}
            trigger={trigger}
            errors={errors}
            validation={{ required: true, pattern: /^[a-zA-Z]+$/ }}
          />
          <Input
            title={"your username"}
            name="username"
            type="text"
            register={register}
            watch={watch}
            trigger={trigger}
            errors={errors}
            validation={{ required: true, pattern: /^[a-zA-Z0-9]+$/ }}
          />
          <Input
            title="Email"
            name="email"
            type="email"
            register={register}
            errors={errors}
            validation={{
              required: true,
              pattern: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/,
            }}
            watch={watch}
            control={control}
            trigger={trigger}
          />
          <Input
            title={"Password"}
            name="password"
            type="password"
            register={register}
            watch={watch}
            trigger={trigger}
            errors={errors}
            validation={{ required: true, pattern: /^[a-zA-Z0-9]+$/ }}
          />
          <button
            type="submit"
            className="bg-zinc-100 rounded-lg px-3 py-2 bg-opacity-30 text-black hover:bg-zinc-50 transition-all font-bold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
