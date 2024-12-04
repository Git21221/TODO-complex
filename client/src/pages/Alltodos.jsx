import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTodo } from "../features/todos/todoSlice.js";
import "./handleCss.css";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { alltodos, edittodo } from "../APIs/backend.api.js";
import { removeAuth } from "../persist/authPersist.js";
import { setUser } from "../features/login/authSlice.js";
import { setError, setSuccess } from "../features/messageSlice.js";
import { setLoading } from "../features/loadingSlice.js";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HorizontalRuleRoundedIcon from "@mui/icons-material/HorizontalRuleRounded";
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';

function Alltodos() {
  const [editedTodoName, setEditedTodoName] = useState("");
  const [editedTodoDesc, setEditedTodoDesc] = useState("");
  const [editingTodoId, setEditingTodoId] = useState("");
  const [hoverTodoId, setHoverTodoId] = useState("");
  const dispatch = useDispatch();
  const { todo } = useSelector((state) => state.todo);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [todos, setTodos] = useState([]);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    dispatch(setLoading({ isLoading: true }));
    const fetchData = async () => {
      const response = await alltodos("GET");
      if (response.ok) {
        const incomingTodos = await response.json();
        dispatch(setLoading({ isLoading: false }));
        dispatch(setTodo({ todo: incomingTodos.data, isChanged: false })); //storing in store to spread
        setTodos(incomingTodos.data);
        setTodo(incomingTodos.data);
      } else {
        removeAuth();
        dispatch(setUser({ user: null, isAuthenticated: false }));
        dispatch(setLoading({ isLoading: false }));
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
    dispatch(setLoading({ isLoading: true }));
    let data;
    console.log(todos);
    const updatedTodos = todo.map((todo) => {
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
    setTodos(updatedTodos);
    dispatch(setTodo({ todo: updatedTodos }));
    setEditingTodoId(null);

    const res = await edittodo(data, "POST");
    const editedTodo = await res.json();

    if (!res.ok) {
      dispatch(setLoading({ isLoading: false }));
      dispatch(
        setError({
          isMessage: true,
          message: "Something went wrong",
          type: "error",
        })
      );
    } else {
      dispatch(setLoading({ isLoading: false }));
      dispatch(
        setSuccess({
          isMessage: true,
          message: editedTodo.message,
          type: "success",
        })
      );
    }
  };

  const handleHover = (todoid) => {
    setHoverTodoId(todoid);
    setHover(true);
  };

  const handleEditedTodoCancel = () => {
    setEditingTodoId(null);
  };

  if (isAuthenticated) {
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
            onMouseEnter={() => {
              handleHover(todo._id);
            }}
            onMouseLeave={() => setHover(false)}
            key={todo._id}
            className="todos relative p-4 rounded-lg w-72 h-auto bg-zinc-700 bg-opacity-60"
          >
            {hover && hoverTodoId === todo._id && (
              <div className="controls absolute flex gap-2 top-[-8px]">
                <div className="h-4 bg-red-500 w-4 rounded-3xl flex items-center justify-center text-black">
                  <CloseRoundedIcon style={{ fontSize: "17px", padding: 0 }} />
                </div>
                <div className="h-4 bg-yellow-500 w-4 rounded-3xl flex items-center justify-center text-black">
                  <HorizontalRuleRoundedIcon
                    style={{ fontSize: "17px", padding: 0 }}
                  />
                </div>
                <div className="h-4 bg-green-500 w-4 rounded-3xl flex items-center justify-center text-black">
                  <OpenInFullRoundedIcon style={{ fontSize: "14px", padding: 0 }} />
                </div>
              </div>
            )}
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
                <button
                  className="py-2 px-4 rounded-lg"
                  onClick={handleEditedTodoSave}
                >
                  Save
                </button>
                <button
                  className="py-2 px-4 rounded-lg"
                  onClick={handleEditedTodoCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pt-16 h-screen flex items-center justify-center">
      <Helmet>
        <title>Home | TODO</title>
      </Helmet>
      <p className="text-7xl p-3">signup ba login kor</p>
    </div>
  );
}

export default Alltodos;
