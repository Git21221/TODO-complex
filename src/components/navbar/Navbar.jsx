import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
function Navbar() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/getCurrentuser`;
  const hostedServer = `${import.meta.env.VITE_HOSTED_SERVER_LINK}/users/getCurrentuser`;

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = null;
        import.meta.env.VITE_DEVELOPMENT_ENV === "true"
          ? (response = await fetch(localServer, requestOptions))
          : await fetch(hostedServer, requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
    
      console.log(userData);
    
    }, [userData]);
    if (!userData) {
      return (
        <div className="navBody fixed w-full flex justify-between items-center bg-zinc-950 bg-opacity-40 backdrop-blur-3xl text-white p-5">
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
      <div className="navBody fixed w-full flex justify-between items-center bg-zinc-950 bg-opacity-40 backdrop-blur-3xl text-white p-5">
        <div className="logoName">Todo</div>
        <div className="menu">
          <ul className="flex gap-4">
            <li>
              <Link to="/addTodo">Add Todo</Link>
            </li>
            <li>
              <Link to="/allTodos">All Todo</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>
      </div>
    );
}

export default Navbar;
