import React from "react";
import './input.css'

function Input({ type, placeholder, className, onChange }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        className="input py-2 px-4 text-white bg-zinc-700 backdrop-blur-2xl rounded-3xl"
        onChange={onChange}
      />
    </div>
  );
}

export default Input;
