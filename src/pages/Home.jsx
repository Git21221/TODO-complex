import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated)
    return (
      <div className="pt-16 h-screen flex items-center justify-center">
        <Helmet>
          <title>Home | TODO</title>
        </Helmet>
        <p className="font-extrabold text-7xl p-3">Signup or login to continue.</p>
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
