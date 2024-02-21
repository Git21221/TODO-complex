const register = async (data, method) => {
  const requestOptions = {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/register`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/register`;

  let res;
  import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (res = await fetch(localServer, requestOptions))
    : (res = await fetch(hostedServer, requestOptions));
  return res;
};

const login = async (data, method) => {
  const requestOptions = {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/login`;
  const hostedServer = `${import.meta.env.VITE_HOSTED_SERVER_LINK}/users/login`;

  let res;
  import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (res = await fetch(localServer, requestOptions))
    : (res = await fetch(hostedServer, requestOptions));

  return res;
};

const deleteprofile = async (method) => {
  const requestOptions = {
    method,
    credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/deleteProfile`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/deleteProfile`;

  let res;
  import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (res = await fetch(localServer, requestOptions))
    : (res = await fetch(hostedServer, requestOptions));
  return res;
};

const logoutUser = async (method) => {
  const requestOptions = {
    method,
    credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/logout`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/logout`;

  let res;
  import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (res = await fetch(localServer, requestOptions))
    : (res = await fetch(hostedServer, requestOptions));
  return res;
};

const editprofile = async (data, method) => {
  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/editProfile`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/editProfile`;

  const requestOptions = {
    method,
    body: data,
    credentials: "include",
  };

  let res;
  import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (res = await fetch(localServer, requestOptions))
    : (res = await fetch(hostedServer, requestOptions));
  return res;
};

const alltodos = async (method) => {
  const requestOptions = {
    method,
    credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/alltodos`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/alltodos`;

  let response;
  import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (response = await fetch(localServer, requestOptions))
    : (response = await fetch(hostedServer, requestOptions));
  return response;
};

const refreshuser = async (method) => {
  const requestOptions = {
    method,
    credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/refresh`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/refresh`;

  let res;
  import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (res = await fetch(localServer, requestOptions))
    : (res = await fetch(hostedServer, requestOptions));

  return res;
};

const edittodo = async (data, method) => {
  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/editTodo`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/editTodo`;

  const requestOptions = {
    method,
    body: JSON.stringify(data),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res;
  import.meta.env.VITE_DEVELOPMENT_ENV === "true"
    ? (res = await fetch(localServer, requestOptions))
    : (res = await fetch(hostedServer, requestOptions));
    return res;
};

const addtodo = async(data, method) => {
  const requestOptions = {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const localServer = `${
    import.meta.env.VITE_LOCALHOST_SERVER_LINK
  }/users/addTodo`;
  const hostedServer = `${
    import.meta.env.VITE_HOSTED_SERVER_LINK
  }/users/addTodo`;

  let res;
      import.meta.env.VITE_DEVELOPMENT_ENV === "true"
        ? (res = await fetch(localServer, requestOptions))
        : (res = await fetch(hostedServer, requestOptions));
      return res;
}

export {
  register,
  login,
  deleteprofile,
  logoutUser,
  editprofile,
  alltodos,
  refreshuser,
  edittodo,
  addtodo
};
