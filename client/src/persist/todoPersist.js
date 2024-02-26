const setTodoStore = (data) => {
  localStorage.setItem("todos", JSON.stringify(data));
  localStorage.setItem("isChanged", JSON.stringify(true));
}

const getTodo = () => {
  const isChanged = JSON.parse(localStorage.getItem("isChanged"));
  const todos = JSON.parse(localStorage.getItem("todos"));
  return {isChanged, todos};
}

export {setTodoStore, getTodo};