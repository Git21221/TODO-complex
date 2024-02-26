import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { removeAuth } from "../persist/authPersist";
import { setUser } from "../features/login/authSlice";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if(!document.cookie){
    console.log("no cookie");
    removeAuth();
    dispatch(setUser({user: null, isAuthenticated: false}));
  }

  if (!isAuthenticated)
    return (
      <div className="pt-16 h-screen flex items-center justify-center">
        <Helmet>
          <title>Home | TODO</title>
        </Helmet>
        <p className="font-extrabold text-7xl p-3">
          signup ba login kor
        </p>
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
