import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { removeAuth } from "../persist/authPersist";
import { setUser } from "../features/login/authSlice";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [cookies, setCokie, removeCookie] = useCookies([
    "accessToken",
    "refreshToken",
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cookies.length || cookies.accessToken == "" || cookies.refreshToken == "") {
      removeAuth();
      dispatch(setUser({ user: null, isAuthenticated: false }));
    }
  }, []);

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
