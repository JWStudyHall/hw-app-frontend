import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const { user } = useContext(UserContext);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        This is the dashboard page where you can see a list of all the users.
      </p>
      <ul>
        {users.map((userData) => (
          <li key={userData._id}>{userData.username}</li>
        ))}
      </ul>
    </main>
  );
};

export default Dashboard;
