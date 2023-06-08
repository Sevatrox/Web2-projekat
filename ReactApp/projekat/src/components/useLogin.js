import { useState } from "react";

const useLogin = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const handleChange = (value) => {
    setisLoggedIn(value);
  };

  return [isLoggedIn, handleChange];
};

export default useLogin;