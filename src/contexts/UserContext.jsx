import { createContext, useEffect, useState } from "react";
import { verifyUser } from "../services/authService";

const UserContext = createContext();

const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  console.log(token);

  if (!token) return null;
  console.log(JSON.parse(atob(token.split(".")[1])).payload);
  return JSON.parse(atob(token.split(".")[1])).payload;
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(verifyUser());
    // console.log("This is the use effect");
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
