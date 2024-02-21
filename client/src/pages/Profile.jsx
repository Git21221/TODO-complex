import React from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./handleCss.css";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/login/authSlice";
import { deleteprofile, logoutUser } from "../APIs/backend.api";

function Profile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteprofile("GET");
      if (res.ok) navigate(`/signup`);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      const res = await logoutUser("GET");
      if (res.ok) {
        dispatch(setUser({ user: null, isAuthenticated: false }));
        navigate(`/login`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-20 flex gap-4 p-4">
      <Helmet>
        <title>{user.username} | TODO profile</title>
      </Helmet>
      <div className="er bg-zinc-700 p-4 border-gray-300 w-52 flex flex-col gap-4 rounded-xl">
        <div className="profilePic flex h-20 w-20 rounded-xl bg-gray-800">
          <img src={user.avatar} alt="profile picture" />
        </div>
        <div className="profilename p-2">
          {user.fullName} {user.gender}
        </div>
        <Link to="/profile">
          <div className="editAcc p-2 hover:bg-zinc-800 rounded-lg">
            {" "}
            Edit Profile
          </div>
        </Link>
        <div
          className="deleteAcc p-2 hover:bg-zinc-800 rounded-lg"
          onClick={deleteProfile}
        >
          Delete Account
        </div>
        <div
          className="logout p-2 hover:bg-zinc-800 rounded-lg"
          onClick={logout}
        >
          log Out
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-zinc-700 flex items-center justify-center h-48 p-4 rounded-xl w-full">
          Your graph
        </div>
        <div className="bg-zinc-700 flex h-48 p-4 rounded-xl items-center justify-center w-full">
          Set Goal
        </div>
      </div>
    </div>
  );
}

export default Profile;
