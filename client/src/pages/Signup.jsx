import React, { useState } from "react";
import { Input } from "../components/index.js";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { register } from "../APIs/backend.api.js";
import { useDispatch } from "react-redux";
import { setUser } from "../features/login/authSlice.js";
import { removeAuth } from "../persist/authPersist.js";
import { setError, setSuccess } from "../features/messageSlice.js";
import { setLoading } from "../features/loadingSlice.js";

function Signup() {
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setisValidEmail] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  document.addEventListener("cookiechange", () => {
    if (!document.cookie) {
      console.log("no cookie");
      removeAuth();
      dispatch(setUser({ user: null, isAuthenticated: false }));
    }
  });

  const data = { fullName, email, username, password };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await register(data, "POST");
      const userData = await res.json();
      console.log(userData);
      if (res.ok) {
        dispatch(setLoading({ isLoading: true }));
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
      console.log(error.message);
    }
  };

  return (
    <div className="img-container h-screen w-screen flex items-center justify-center flex-col gap-8 text-white">
      <div className="form bg-zinc-700 p-10 rounded-2xl bg-opacity-60 backdrop-blur-3xl flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Register yourself</h1>
        <form
          method="post"
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            type="text"
            placeholder="Full Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
