import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getPlans } from "../../services/planService.js";

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(True);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError("");
      try {
        const plansData = await getPlans();
        const publicPlans = Array.isArray(plansData)
          ? plansData.filter((plan) => plan.is_public)
          : [];
        setPlans(publicPlans);
      } catch (error) {
        setError("Could not load public plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);
  if (loading) return <h3>Loading workout plans...</h3>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  if (!plans.length)
    return (
      <h1 style={{ textAlign: "center" }}>
        Let's get moving! Create your first workout plan.
      </h1>
    );

  return (
<<<<<<< HEAD
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
      <h1>Public Workout Plans</h1>
      <p>Browse plans created by the community.</p>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {plans.map((plan) => (
          <Link
            key={plan.id}
            to={`/plans/${plan.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <article
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "0.9rem",
              }}
            >
              <h3 style={{ margin: "0 0 0.25rem 0" }}>{plan.title}</h3>
              <p style={{ margin: "0 0 0.35rem 0" }}>
                {plan.user?.username ? `By ${plan.user.username}` : "Public plan"}
              </p>
              <p style={{ margin: 0 }}>
                {plan.template_links?.length || 0} template
                {plan.template_links?.length === 1 ? "" : "s"}
              </p>
            </article>
          </Link>
        ))}
=======
    <>
      <div>
        <h1>{plans?.user?.username}'s Workout Plans</h1>
        <div></div>
>>>>>>> 09849087cfaaea1b059b1e0344ad5d4c00b0e23d
      </div>
    </div>
  );
};

export default PlansList;