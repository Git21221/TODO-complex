import React from "react";
import { Helmet } from "react-helmet";
import { Input } from "../components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { forgetPassword } from "../APIs/backend.api";
import { setLoading } from "../features/loadingSlice";
import { setError, setSuccess } from "../features/messageSlice";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const dispatch = useDispatch();
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
    dispatch(setLoading({ isLoading: true }));
    // validate all details
    try {
      const res = await forgetPassword(data, "POST");

      const userData = await res.json();

      if (res.ok) {
        console.log(res);
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
        console.log(userData);
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
      console.log(error);
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
      <Helmet>
        <title>Sign In | TODO</title>
      </Helmet>
      <div className="form bg-neutral-800 border border-neutral-600 lg:p-10 md:p-5 p-5 rounded-2xl w-full flex flex-col items-center justify-center gap-6 mx-5">
        <h1 className="text-3xl font-bold">Forget password</h1>
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={handleSubmit(submitHandler)}
        >
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
            title={"New password"}
            name="newPassword"
            type="password"
            register={register}
            watch={watch}
            trigger={trigger}
            errors={errors}
            validation={{ required: true, pattern: /^[a-zA-Z0-9]+$/ }}
          />
          <Input
            title={"Confirm new password"}
            name="confirmNewPassword"
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
            Submit
          </button>
        </form>
      </div>
      Already a member? signup
    </div>
  );
}

export default ForgetPassword;
