import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullname] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username,
      email,
      fullName,
      password,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/register",
        requestOptions
      );
      console.log("response done", response);
      if (!response.ok) throw new Error("Network response not ok");
      const responseData = await response.json();
      console.log("responseData", responseData);
    } catch (error) {
      console.error("mongo error", error.message);
    }
  };

  return (
    <div className="img-container">
      <img
        src="/pexels-sebastian-coman-photography-3461205.jpg"
        className="cover-photo"
      />
      <form method="post" className="form">
        <h1>Register yourself!</h1>
        <div className="formbody">
          <div className="name">
            <p>Name</p>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullname(e.target.value);
              }}
            />
          </div>
          <div className="email">
            <p>Email</p>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="username">
            <p>Username</p>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="password">
            <p>Password</p>
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="submit">
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
