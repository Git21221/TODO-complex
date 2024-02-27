import React from "react";
import "./App.css";
import { Navbar, Footer, Loader } from "./components/index.js";
import { Outlet } from "react-router-dom";
import Message from "./components/message/Message.jsx";
import { useSelector } from "react-redux";

function App() {
  const { isMessage, message, type } = useSelector((state) => state.message);
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
