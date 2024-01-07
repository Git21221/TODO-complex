import React, { useState } from "react";

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
    try {
      const response = await fetch(
        "https://backendfortodo-production.up.railway.app/api/v1/users/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      console.log("response done", response);
      if(!response.ok) throw new Error('Network response not ok');
      const responseData = await response.json();
      console.log("responseData", responseData);
    } catch (error) {
      console.log("mongo error",error);
    }
  };

  return (
    <>
      <form method="post">
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="text"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullname(e.target.value);
          }}
        />
        <button onClick={handleSubmit}>submit</button>
      </form>
    </>
  );
}

export default App;
