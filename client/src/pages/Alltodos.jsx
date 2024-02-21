import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTodo } from "../features/todos/todoSlice.js";
import { setUser } from "../features/login/authSlice.js";
import "./handleCss.css";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { alltodos, edittodo, refreshuser } from "../APIs/backend.api.js";

function Alltodos() {
  const [editedTodoName, setEditedTodoName] = useState("");
  const [editedTodoDesc, setEditedTodoDesc] = useState("");
  const [editingTodoId, setEditingTodoId] = useState("");
  const dispatch = useDispatch();
  const { todo } = useSelector((state) => state.todo);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await alltodos("GET");
      if (response.ok) {
        const todos = await response.json();
        console.log(todos);
        dispatch(setTodo(todos.data));
        setTodos(todos.data);
      }
      // if(!response.ok) console.log("nhi hoga");
      if (!response.ok) {
        const res = await refreshuser("GET");
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

    const res = await edittodo(data, "POST");
    if (!res.ok) return null;
  };

  const handleEditedTodoCancel = () => {
    setEditingTodoId(null);
  }

  return (
    <div
      className="flex items-center justify-center flex-wrap gap-8 bg-zinc-950 text-white pt-24 pb-10 bg-fixed"
      key={todo._id}
    >
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

          </div>
          <div className="bar flex gap-4">
            <hr className="border-1 border-gray-600 mt-2 mb-2 w-full" />
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="off"
              onClick={() => handleTodoEdit(todo._id)}
            />

          </div>
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
            <div className="flex gap-4 justify-around mt-4">
              <button className="py-2 px-4 rounded-lg" onClick={handleEditedTodoSave}>
                Save
              </button>
              <button className="py-2 px-4 rounded-lg" onClick={handleEditedTodoCancel}>
                Cancel
              </button>
            </div>
            
          )}
        </div>
      ))}
    </div>
  );
}

export default Alltodos;
