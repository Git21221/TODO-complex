import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
function Navbar() {
  const requestOptions = {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res;
  const load = async () => {
    res = await fetch(
      "http://localhost:8000/api/v1/users/getCurrentuser",
      requestOptions
    );
  };
  load();
  if (!res) {
    return (
      <div className="navBody fixed w-full flex justify-between items-center bg-zinc-950 bg-opacity-40 backdrop-blur-3xl text-white p-5">
        <div className="logoName">Todo</div>
        <div className="menu">
          <ul className="flex gap-4">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  } else return (
    <div className="navBody fixed w-full flex justify-between items-center bg-zinc-950 bg-opacity-40 backdrop-blur-3xl text-white p-5">
        <div className="logoName">Todo</div>
        <div className="menu">
          <ul className="flex gap-4">
            <li>Hello</li>
          </ul>
        </div>
      </div>
  );
}

export default Navbar;
