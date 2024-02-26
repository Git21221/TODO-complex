import React, { useState, useEffect } from "react";
import { Input } from "../components/index.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { removeAuth } from "../persist/authPersist.js";
import "./handleCss.css";
import { addtodo } from "../APIs/backend.api.js";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/login/authSlice.js";

function Addtodo() {

  const dispatch = useDispatch();

  document.addEventListener('cookiechange', () => {
    if(!document.cookie){
      console.log("no cookie");
      removeAuth();
      dispatch(setUser({user: null, isAuthenticated: false}));
    }
  })
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [todoName, setTodo] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const navigate = useNavigate();

  const data = { todoName, todoDesc };

  const submitHandler = async (e) => {
    e.preventDefault();

    if ([todoName, todoDesc].some((field) => field === ""))
      console.log("all fields are required");

    try {
      const res = await addtodo(data, "POST");
      if (res.ok){
        navigate("/allTodos");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 flex-col gap-8 text-white">
        <Helmet>
          <title>Add Todo | TODO</title>
        </Helmet>
        <div className="form bg-zinc-700 p-10 rounded-xl bg-opacity-60 flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold">Add your Todo</h1>
          {/* <p className={}>{message}</p> */}
          <form
            method="post"
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              type="text"
              placeholder="Todo Name"
              onChange={(e) => {
                setTodo(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="description"
              onChange={(e) => {
                setTodoDesc(e.target.value);
              }}
            />
            <button
              className="bg-zinc-100 rounded-3xl px-3 py-2 bg-opacity-30 text-black hover:bg-zinc-50 transition-all font-bold"
              onClick={submitHandler}
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
      <p className="font-extrabold text-7xl p-3">
        signup ba login kor
      </p>
    </div>
  );
}

export default Addtodo;
