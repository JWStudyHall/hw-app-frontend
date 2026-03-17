import { createContext, useEffect, useState } from "react";
import { verifyUser } from "../services/authService";
import { useNavigate } from "react-router";

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
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await verifyUser();
        setUser(user);
      } catch (error) {
        setUser(null);

      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };