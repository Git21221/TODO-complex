import React, { useState } from "react";
import { Input } from "../components/index.js";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/login/authSlice.js";
import { login } from "../APIs/backend.api.js";
import { setAuth } from "../persist/authPersist.js";
import { setLoading } from "../features/loadingSlice.js";
import { setError, setSuccess } from "../features/messageSlice.js";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = username;

  const data = { email, username, password };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading({ isLoading: true }));
    //validate all details
    try {
      const res = await login(data, "POST");

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
        dispatch(setUser({ user: userData.data, isAuthenticated: true }));
        setAuth(userData.data);
        navigate("/");
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
    <div className="img-container h-screen w-screen flex items-center justify-center flex-col gap-8 text-white">
      <Helmet>
        <title>Sign In | TODO</title>
      </Helmet>
      <div className="form bg-zinc-700 p-10 rounded-2xl bg-opacity-60 backdrop-blur-3xl flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Login</h1>
        <form
          method="post"
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            type="text"
            placeholder="Username or email"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="bg-zinc-100 rounded-3xl px-3 py-2 bg-opacity-30 text-black hover:bg-zinc-50 transition-all font-bold"
            onClick={submitHandler}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
