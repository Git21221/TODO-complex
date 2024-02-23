const setAuth = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("isAuthenticated", JSON.stringify(true));
};

const setTodoStore = (data) => {
  localStorage.setItem("todos", JSON.stringify(data));
  localStorage.setItem("isChanged", JSON.stringify(true));
}

const removeAuth = () => {
  localStorage.setItem("user", JSON.stringify({}));
  localStorage.setItem("isAuthenticated", JSON.stringify(false));
};

const getAuth = () => {
  const isAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated"));
  const user = JSON.parse(localStorage.getItem("user"));
  return {user, isAuthenticated};
}

const getTodo = () => {
  const isChanged = JSON.parse(localStorage.getItem("isChanged"));
  const todos = JSON.parse(localStorage.getItem("todos"));
  return {isChanged, todos};
}

export {setAuth, setTodoStore, removeAuth, getAuth, getTodo};
