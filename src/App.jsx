import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let { emptyField, emailValidation } = new Boolean(true);
  emailValidation = false;

  const validateDetails = (username, email, fullName, password) => {
    if (
      [username, email, fullName, password].some((field) => field.trim() === "")
    )
      emptyField = true;
    else emptyField = false;
  };

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username,
      email,
      fullName,
      password,
    };
    validateDetails(username, email, fullName, password);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    if (emptyField) {
      setErrorMessage("All fields are required!");
    } else if (!isValidEmail(email)) {
      setErrorMessage("Email is not valid!");
    } else {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/users/register",
          requestOptions
        );
        console.log(response);
        if (!response.ok) {
          return response.json().catch((err) => {
            if (response.status >= 400) {
              setErrorMessage(
                "User already exists with that username or email!"
              );
            }
          });
        }
        else{

        }
      } catch (error) {
        console.error("Network error", error.message);
      }
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
        <p className="emptyErrorMSG">{errorMessage}</p>
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
          <p></p>
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
          <p></p>
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
          <p></p>
          <div className="password">
            <p>Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <p></p>
          <div className="submit">
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
