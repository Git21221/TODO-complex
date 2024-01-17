import React from "react";
import ReactDOM from "react-dom/client";
import {
  Addtodo,
  Alltodos,
  App,
  Home,
  Signin,
  Signup,
} from "./components/index.js";

import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/addTodo",
        element: <Addtodo />,
      },
      {
        path: "/allTodos",
        element: <Alltodos />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
