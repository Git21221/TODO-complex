import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { removeAuth } from "../persist/authPersist";
import { setUser } from "../features/login/authSlice";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { getcurrentuser } from "../APIs/backend.api";
import { setLoading } from "../features/loadingSlice";
import { setError, setSuccess } from "../features/messageSlice";

function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading({ isLoading: true }));
    const fetchUser = async () => {
      const res = await getcurrentuser();
      const userData = await res.json();
      console.log(userData);
      if (!res.ok) {
        dispatch(setUser({ user: null, isAuthenticated: false }));
        removeAuth();
        dispatch(setLoading({ isLoading: false }));
        dispatch(
          setError({
            isMessage: true,
            message: userData.message,
            type: "error",
          })
        );
      } else {
        dispatch(setLoading({ isLoading: false }));
        dispatch(
          setSuccess({
            isMessage: true,
            message: userData.message,
            type: "success",
          })
        );
      }
    };
    fetchUser();
  }, [dispatch]);

  if (!isAuthenticated)
    return (
      <div className="pt-16 h-screen flex items-center justify-center">
        <Helmet>
          <title>Home | TODO</title>
        </Helmet>
        <p className="text-7xl p-3">signup ba login kor</p>
      </div>
    );
  return (
    <div className="pt-16 h-screen flex items-center justify-center">
      <Helmet>
        <title>Home | TODO</title>
      </Helmet>
      <p className="text-7xl"> Todo </p>
    </div>
  );
}

export default Home;
