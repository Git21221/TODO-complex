import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTodo } from "../features/todos/todoSlice.js";
import "./handleCss.css";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

function Alltodos() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { todo } = useSelector((state) => state.todo);

  const requestOptions = {
    method: "GET",
    // credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/alltodos`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/alltodos`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        import.meta.env.VITE_DEVELOPMENT_ENV === "true"
          ? (response = await fetch(localServer, requestOptions))
          : (response = await fetch(hostedServer, requestOptions));
        console.log(response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const todos = await response.json();
        dispatch(setTodo(todos.data));
        console.log(todos.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const handleEdit = () => {
      console.log("Hello");
    };

    const addEventListeners = () => {
      // Query all elements with class "todoName" and add event listener to each
      document.querySelectorAll(".todoName").forEach((element) => {
        element.addEventListener("click", handleEdit);
      });
    };

    addEventListeners(); // Call the function to add event listeners initially

    return () => {
      // Remove event listeners when the component unmounts
      document.querySelectorAll(".todoName").forEach((element) => {
        element.removeEventListener("click", handleEdit);
      });
    };
  }, []); // Empty dependency array ensures that the effect runs once when the component mounts

  return (
    <div className="flex items-center justify-center flex-wrap gap-8 bg-zinc-950 text-white pt-24 pb-10 bg-fixed">
      <Helmet>
        <title>All Todos | TODO</title>
      </Helmet>
      {todo.map((todo) => (
        <div
          key={todo._id}
          className="todos p-4 rounded-lg w-72 h-auto bg-zinc-700 bg-opacity-60"
        >
          <div className="flex items-center justify-between">
            <input
              className="todoName bg-transparent focus-within: border-none"
              value={todo.todoName}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />

            <FontAwesomeIcon icon={faPenToSquare} className="off" />
          </div>

          <hr className="border-1 border-gray-600 mt-2 mb-2" />
          <p>{todo.todoDesc} </p>
        </div>
      ))}
    </div>
  );
}

export default Alltodos;
