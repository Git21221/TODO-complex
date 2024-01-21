import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function Profile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const {username} = useParams();
  console.log(user);
  return (
    <div className="pt-20 flex gap-4 p-4">
      <Helmet>
        <title>{user.username} | TODO profile</title>
      </Helmet>
      <div className="er h-screen bg-zinc-700 p-4 border-gray-300 w-52 flex flex-col gap-4 rounded-xl">
        <div className="profilePic h-20 w-20 rounded-xl bg-gray-800">
          <img src={user.profilePic} alt="profile picture" />
        </div>
        <div className="profilename">{user.fullName}</div>
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
