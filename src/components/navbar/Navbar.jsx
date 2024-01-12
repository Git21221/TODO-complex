import React from "react";
import './navbar.css'
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <div className="navBody fixed w-full flex justify-between items-center bg-zinc-950 bg-opacity-40 backdrop-blur-3xl text-white p-5">
      <div className="logoName">Todo</div>
      <div className="menu">
        <ul className="flex gap-4">
          <li><Link to='/login'>Login</Link></li>
          <li><Link to='/signup'>Signup</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
