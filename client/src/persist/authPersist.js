// import Cookies from 'js-Cookie';

const setAuth = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("isAuthenticated", JSON.stringify(true));
};

const removeAuth = () => {
  localStorage.setItem("user", JSON.stringify({}));
  localStorage.setItem("isAuthenticated", JSON.stringify(false));
};

const getAuth = () => {
  const isAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated"));
  // console.log(Cookies.get('accessToken'));
  const user = JSON.parse(localStorage.getItem("user"));
  return {user, isAuthenticated};
}


export {setAuth, removeAuth, getAuth};
