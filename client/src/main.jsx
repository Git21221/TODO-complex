import React from "react";
import ReactDOM from "react-dom/client";
import {
  Addtodo,
  Alltodos,
  App,
  Home,
  Signin,
  Signup,
  Editprofile,
  Profile,
  VerifyEmail,
} from "./components/index.js";

import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { CookiesProvider } from "react-cookie";
import ForgetPassword from "./pages/ForgetPassword.jsx";

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
      {
        path: "/:username",
        element: <Profile />,
      },
      {
        path: "/profile",
        element: <Editprofile />,
      },
      {
        path: '/verify-email',
        element: <VerifyEmail />
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <RouterProvider router={router} />
    </CookiesProvider>
  </Provider>
);
