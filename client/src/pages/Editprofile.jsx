import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Input } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/login/authSlice";

function Editprofile() {
  const { user } = useSelector((state) => state.auth);
  const [updatedName, setName] = useState(user.fullName);
  const [updatedEmail, setEmail] = useState(user.email);
  const [updatedAvatar, setAvatar] = useState("");
  const [updatedDate, setDate] = useState(user.dateofBirth);
  const [updatedMonth, setMonth] = useState(user.monthofBirth);
  const [updatedYear, setYear] = useState(user.yearofBirth);
  const [updatedGender, setGender] = useState("Male");
  const [imagetoShow, setimagetoShow] = useState("");
  const handleFileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(
    updatedName,
    updatedEmail,
    updatedAvatar,
    updatedDate,
    updatedMonth,
    updatedYear,
    updatedGender
  );

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/editProfile`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/editProfile`;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setimagetoShow(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formdata = new FormData();

  formdata.append("avatar", updatedAvatar);
  formdata.append("updatedName", updatedName);
  formdata.append("updatedEmail", updatedEmail);
  formdata.append("updatedDate", updatedDate);
  formdata.append("updatedMonth", updatedMonth);
  formdata.append("updatedYear", updatedYear);
  formdata.append("updatedGender", updatedGender);

  const requestOptions = {
    method: "POST",
    body: formdata,
    credentials: "include",
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      let res;
      import.meta.env.VITE_DEVELOPMENT_ENV === "true"
        ? (res = await fetch(localServer, requestOptions))
        : (res = await fetch(hostedServer, requestOptions));
      const userData = await res.json();
      dispatch(setUser({ user: userData.data, isAuthenticated: true }));
      navigate(`/${user.username}`);
    } catch (error) {
      console.log(error);
    }
  };

  const currYear = new Date().getFullYear();
  const years = Array.from({ length: currYear - 1899 }, (_, i) => 1900 + i);
  const days = Array.from({ length: 31 }, (_, i) => 1 + i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="pt-16 h-screen w-screen flex items-center justify-center bg-zinc-950 flex-col gap-8 text-white">
      <Helmet>
        <title>Profile | TODO</title>
      </Helmet>
      <div className="form bg-zinc-700 p-10 rounded-xl bg-opacity-60 flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Update Profile</h1>
        {/* <p className={}>{message}</p> */}
        <form
          method="post"
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="nameemailandpic flex gap-3">
            <div className="nameEmail flex flex-col gap-3">
              <Input
                type="text"
                value={updatedName}
                placeholder="Full Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Input
                type="text"
                value={updatedEmail}
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <label
              htmlFor="file"
              onClick={() => {
                handleFileRef.current.click();
              }}
            >
              <div className="avatar flex h-24 w-24 bg-slate-600 rounded-lg">
                <img src={imagetoShow ? imagetoShow : user.avatar} alt="" />
                <Input
                  id="file"
                  type="file"
                  ref={handleFileRef}
                  onChange={handleImageChange}
                />
              </div>
            </label>
          </div>
          <div className="flex flex-col gap-3">
            <span>Choose your gender</span>
            <div className="gender">
              <select
                onChange={(e) => setGender(e.target.value)}
                name="genders"
                id="gender"
                value={updatedGender}
                className="text-black p-2 rounded-lg"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span>Enter your Date of Birth</span>
            <div className="mdy flex gap-3">
              <select
                name="dob"
                id="year"
                value={updatedYear}
                onChange={(e) => setYear(e.target.value)}
                className="text-black p-2 rounded-lg"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                name="dob"
                id="date"
                value={updatedDate}
                onChange={(e) => setDate(e.target.value)}
                className="text-black p-2 rounded-lg"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                name="dob"
                id="month"
                value={updatedMonth}
                onChange={(e) => setMonth(e.target.value)}
                className="text-black p-2 rounded-lg"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="bg-zinc-100 rounded-3xl px-3 py-2 bg-opacity-30 text-black hover:bg-zinc-50 transition-all font-bold"
            onClick={submitHandler}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default Editprofile;
