import React, {forwardRef} from "react";
import "./input.css";

const Input = forwardRef(({ type, placeholder, onChange, value }, ref) => {
  return (
    <div>
      <input
        ref={ref}
        value={value}
        type={type}
        placeholder={placeholder}
        className="input py-2 px-4 text-white bg-zinc-700 backdrop-blur-2xl rounded-3xl"
        onChange={onChange}
        autoComplete="true"
      />
    </div>
  );
})

export default Input;
