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
        path: "/addtodo",
        element: <Addtodo />,
      },
      {
        path: "/alltodos",
        element: <Alltodos />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
