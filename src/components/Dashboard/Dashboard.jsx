import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const { user } = useContext(UserContext);

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>This is the dashboard page</p>
    </main>
  );
};

export default Dashboard;
