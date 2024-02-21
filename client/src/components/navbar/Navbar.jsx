import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="navBody fixed w-full flex justify-between items-center bg-zinc-800  text-white p-5 z-50 border-gray-400">
        <div className="logoName">Todo</div>
        <div className="menu">
          <ul className="flex gap-4">
            <li>
              <Link to="/login">login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="navBody fixed w-full flex justify-between items-center bg-zinc-800 text-white p-5 z-50">
      <div className="logoName">Todo</div>
      <div className="menu">
        <ul className="flex gap-4">
          <li>
            <Link to="/addTodo">
              <span>Add Todo</span>
            </Link>
          </li>
          <li>
            <Link to="/allTodos">
              <span>All Todo</span>
            </Link>
          </li>
          <li>
            <Link to="/search">
              <span>Search</span>
            </Link>
          </li>
          <li>
            <Link to={`/${user.username}`}>
              <span>
                <FontAwesomeIcon icon={faUser} className="accountLogo" />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
