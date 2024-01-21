import React, { useState, useEffect } from "react";
import { Input } from "../components/index.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import './addtodo.css'
function Addtodo() {
  const [todoName, setTodo] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
const navigate = useNavigate();
  
  
  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/addTodo`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/addTodo`;
  
  const data = { todoName, todoDesc };
  
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(data);
    if ([todoName, todoDesc].some((field) => field === ""))
    console.log("all fields are required");
  try {
    let res;
    import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (res = await fetch(localServer, requestOptions))
    : (res = await fetch(hostedServer, requestOptions));
    navigate('/alltodos');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='img-container h-screen w-screen flex items-center justify-center bg-zinc-950 flex-col gap-8 text-white'>
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

export default Addtodo;
