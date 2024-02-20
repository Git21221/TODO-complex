import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTodo } from "../features/todos/todoSlice.js";
import { setUser } from "../features/login/authSlice.js";
import "./handleCss.css";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

function Alltodos() {
  const [editedTodoName, setEditedTodoName] = useState("");
  const [editedTodoDesc, setEditedTodoDesc] = useState("");
  const [editingTodoId, setEditingTodoId] = useState("");
  const dispatch = useDispatch();
  const { todo } = useSelector((state) => state.todo);
  const [todos, setTodos] = useState([]);

  const requestOptions = {
    method: "GET",
    credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/alltodos`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/alltodos`;

  const localServerRefresh = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/refresh`;
  const hostedServerRefresh = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/refresh`;

  const localServerTodoEdit = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/editTodo`;
  const hostedServerTodoEdit = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/editTodo`;

  useEffect(() => {
    const fetchData = async () => {
      let response;
      import.meta.env.VITE_DEVELOPMENT_ENV === "true"
        ? (response = await fetch(localServer, requestOptions))
        : (response = await fetch(hostedServer, requestOptions));
      if (response.ok) {
        const todos = await response.json();
        console.log(todos);
        dispatch(setTodo(todos.data));
        setTodos(todos.data);
      }
      // if(!response.ok) console.log("nhi hoga");
      if (!response.ok) {
        let res;
        import.meta.env.VITE_DEVELOPMENT_ENV === "true"
          ? (res = await fetch(localServerRefresh, requestOptions))
          : (res = await fetch(hostedServerRefresh, requestOptions));

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const userdata = await res.json();
        dispatch(setUser({ user: userdata.data, isAuthenticated: true }));
        console.log(userdata);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleTodoEdit = (todoid) => {
    setEditingTodoId(todoid);
    const editTodo = todos.find((todo) => todo._id === todoid);
    if (editTodo) {
      setEditedTodoName(editTodo.todoName);
      setEditedTodoDesc(editTodo.todoDesc);
    }
  };

  const handleEditedTodoSave = async () => {
    let data;
    const updatedTodos = todos.map((todo) => {
      if (todo._id === editingTodoId) {
        data = {
          todoid: todo._id,
          todoName: editedTodoName,
          todoDesc: editedTodoDesc,
        };
        return {
          ...todo,
          todoName: editedTodoName,
          todoDesc: editedTodoDesc,
          todoid: todo._id,
        };
      }
      return todo;
    });
    console.log(updatedTodos);
    setTodos(updatedTodos);
    dispatch(setTodo(updatedTodos));
    setEditingTodoId(null);
    const requestOptionsToEdit = {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let res;
    import.meta.env.VITE_DEVELOPMENT_ENV === "true"
      ? (res = await fetch(localServerTodoEdit, requestOptionsToEdit))
      : (res = await fetch(hostedServerTodoEdit, requestOptionsToEdit));
    if (!res.ok) return null;
  };

  return (
    <div className="flex items-center justify-center flex-wrap gap-8 bg-zinc-950 text-white pt-24 pb-10 bg-fixed" key={todo._id}>
      <Helmet>
        <title>All Todos | TODO</title>
      </Helmet>
      {todo.map((todo) => (
        <div
          key={todo._id}
          className="todos p-4 rounded-lg w-72 h-auto bg-zinc-700 bg-opacity-60"
        >
          <div className="flex items-center justify-between">
            {editingTodoId === todo._id ? (
              <input
                className="todoName bg-transparent focus-within: border-none"
                value={editedTodoName}
                onChange={(e) => {
                  setEditedTodoName(e.target.value);
                }}
              />
            ) : (
              <p>{todo.todoName}</p>
            )}

            <FontAwesomeIcon
              icon={faPenToSquare}
              className="off"
              onClick={() => handleTodoEdit(todo._id)}
            />
          </div>

          <hr className="border-1 border-gray-600 mt-2 mb-2" />
          {editingTodoId === todo._id ? (
            <input
              className="todoName bg-transparent focus-within: border-none"
              value={editedTodoDesc}
              onChange={(e) => {
                setEditedTodoDesc(e.target.value);
              }}
            />
          ) : (
            <p>{todo.todoDesc} </p>
          )}
          {editingTodoId === todo._id && (
            <button className="p-2" onClick={handleEditedTodoSave}>
              save
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Alltodos;
