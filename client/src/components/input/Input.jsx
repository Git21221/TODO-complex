import React, { useEffect, useRef, useState } from "react";
const Input = ({
  title,
  type,
  name,
  register,
  watch,
  errors,
  validation,
  trigger,
}) => {
  const [floatLabelUp, setFloatLabelUp] = useState(false);
  let isError = false;
  const divRef = useRef();
  const inputName = name;
  let inputValue = watch(`${name}`);
  const handleLabelUp = () => {
    console.log(name);
    setFloatLabelUp(true);
    document.getElementById(`${name}`).focus();
  };
  const handleLabelDown = () => {
    setFloatLabelUp(false);
    document.getElementById(`${name}`).blur();
  };

  //if clicked outside the input field then set the label down
  useEffect(() => {
    const handleClickOutside = (e) => {
      inputValue = watch(`${name}`);
      if (
        divRef.current &&
        !divRef.current.contains(e.target) &&
        inputValue !== undefined &&
        inputValue !== ""
      ) {
        setFloatLabelUp(false);
        trigger(`${name}`);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [inputValue]);
  if (
    errors[inputName]?.type === "pattern" ||
    errors[inputName]?.type === "required"
  ) {
    isError = true;
  } else {
    isError = false;
  }

  return (
    <div
      ref={divRef}
      className={`relative w-full`}
      onFocus={handleLabelUp}
      onBlur={handleLabelDown}
      onClick={handleLabelUp}
    >
      <label
        id={`${title}`}
        className={`absolute duration-200 px-2 ${
          floatLabelUp || inputValue
            ? "-top-[0.55rem] text-sm left-2 bg-zinc-800"
            : " top-3 text-lg text-gray-500 left-2 cursor-pointer"
        } ${
          isError && (inputValue || floatLabelUp)
            ? "text-red-700"
            : "text-blue-500"
        } `}
      >
        <p>
          {title}{" "}
          {floatLabelUp ||
            (!inputValue && <sup className="text-red-500">*</sup>)}{" "}
        </p>
      </label>
      <input
        type={type}
        id={`${name}`}
        className={`rounded-lg py-3 px-2 text-base w-full outline-none cursor-pointer border bg-transparent focus:outline-none ${
          floatLabelUp || inputValue ? "border-blue-500" : "border-gray-500"
        } ${
          isError
            ? "border-red-700"
            : floatLabelUp || inputValue
            ? "border-blue-500"
            : ""
        }`}
        {...register(`${name}`, {
          required: validation.required,
          minLength: validation.minLength,
          maxLength: validation.maxLength,
          pattern: validation.pattern,
        })}
        name={name}
        autoComplete="off"
      />
      {errors[inputName]?.type === "required" && (
        <p
          className=" text-red-700 text-[0.75rem] z-[9000] pt-2 "
          role="alert"
        >{`${title} is required`}</p>
      )}
      {errors[inputName]?.type === "pattern" && `${name}` === "email" && (
        <p className=" text-red-700 text-[0.75rem] z-[9000] pt-2 " role="alert">
          {"Enter valid email address"}
        </p>
      )}
    </div>
  );
};
export default Input;
