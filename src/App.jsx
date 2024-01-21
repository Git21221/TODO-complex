import React from "react";
import "./App.css";
import { Navbar, Footer } from "./components/index.js";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
}

export default App;
