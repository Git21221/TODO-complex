import React, { useEffect } from "react";
import "./App.css";
import { Navbar, Footer, Loader } from "./components/index.js";
import { Outlet } from "react-router-dom";
import Message from "./components/message/Message.jsx";
import { useDispatch, useSelector } from "react-redux";
import { resetMessage } from "./features/messageSlice.js";

function App() {
  const { isMessage, message, type } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2500)
  }, [isMessage])
  const { isLoading } = useSelector((state) => state.load);
  return (
    <>
      <Navbar />
      {isMessage && !isLoading && <Message value={message} type={type} />}
      {!isMessage && isLoading && <Loader />}
      <Outlet />
      {/* <Footer /> */}
    </>
  );
}

export default App;
