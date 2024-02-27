import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { removeAuth } from "../persist/authPersist";
import { setUser } from "../features/login/authSlice";
import Cookie from "js-cookie";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  setTimeout(() => {
    if (
      (Cookie.get("accesToken") == undefined &&
        Cookie.get("refreshToken") == undefined) ||
      (!Cookie.get("accessToken") && !Cookie.get("refreshToken"))
    ) {
      removeAuth();
      dispatch(setUser({ user: null, isAuthenticated: false }));
    }
  }, 2000); //update state after 2sex

  if (!isAuthenticated)
    return (
      <div className="pt-16 h-screen flex items-center justify-center">
        <Helmet>
          <title>Home | TODO</title>
        </Helmet>
        <p className="font-extrabold text-7xl p-3">signup ba login kor</p>
      </div>
    );
  return (
    <div className="pt-16 h-screen flex items-center justify-center">
      <Helmet>
        <title>Home | TODO</title>
      </Helmet>
      <p className="font-extrabold text-7xl"> Todo </p>
    </div>
  );
}

export default Home;
