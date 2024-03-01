import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./handleCss.css";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/login/authSlice";
import { deleteprofile, logoutUser } from "../APIs/backend.api";
import { removeAuth } from "../persist/authPersist";
import { setLoading } from "../features/loadingSlice";
import { setError, setSuccess } from "../features/messageSlice";

function Profile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteProfile = async (e) => {
    dispatch(setLoading({ isLoading: true }));
    e.preventDefault();
    try {
      const res = await deleteprofile("GET");
      if (res.ok) {
        dispatch(setLoading({ isLoading: false }));
        dispatch(setUser({ user: null, isAuthenticated: false }));
        dispatch(
          setSuccess({
            isMessage: true,
            message: "Account deleted successfully",
            type: "success",
          })
        );
        removeAuth();
        navigate(`/signup`);
      } else {
        dispatch(
          setError({
            isMessage: true,
            message: "Something went wrong!",
            type: "error",
          })
        );
        removeAuth();
        dispatch(setUser({ user: null, isAuthenticated: false }));
      }
    } catch (error) {
      dispatch(setLoading({ isLoading: false }));
      dispatch(
        setError({
          isMessage: true,
          message: "Something went wrong!",
          type: "error",
        })
      );
    }
  };

  const logout = async (e) => {
    dispatch(setLoading({ isLoading: true }));
    e.preventDefault();
    try {
      const res = await logoutUser("GET");
      if (res.ok) {
        dispatch(setUser({ user: null, isAuthenticated: false }));
        dispatch(setLoading({ isLoading: false }));
        dispatch(
          setSuccess({
            isMessage: true,
            message: "User logged out",
            type: "success",
          })
        );
        removeAuth();
        navigate(`/login`);
      } else {
        removeAuth();
        dispatch(
          setError({
            isMessage: true,
            message: "Soemthing went wrong!",
            type: "error",
          })
        );
        dispatch(setUser({ user: null, isAuthenticated: false }));
      }
    } catch (error) {
      removeAuth();
      dispatch(setUser({ user: null, isAuthenticated: false }));
      dispatch(setLoading({ isLoading: false }));
      dispatch(
        setError({
          isMessage: true,
          message: "Soemthing went wrong!",
          type: "error",
        })
      );
    }
  };
  if (isAuthenticated) {
    return (
      <div className="pt-20 flex gap-4 p-4">
        <div className="er bg-zinc-700 p-4 border-gray-300 w-52 flex flex-col gap-4 rounded-xl">
          <div className="profilePic flex h-20 w-20 rounded-xl bg-gray-800">
            <img src={user?.avatar} alt="profile picture" />
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
  return (
    <div className="pt-16 h-screen flex items-center justify-center">
      <Helmet>
        <title>Home | TODO</title>
      </Helmet>
      <p className="font-extrabold text-7xl p-3">signup ba login kor</p>
    </div>
  );
}

export default Profile;
