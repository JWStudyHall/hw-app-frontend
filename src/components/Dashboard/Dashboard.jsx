import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { Outlet } from "react-router";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <main style={{ padding: "20px" }}>
      <h1>Welcome, {user.username}</h1>
      <p>This is the dashboard page</p>

      <section style={{ marginTop: "20px" }}>
        <Outlet />
      </section>
    </main>
  );
};

export default Dashboard;
