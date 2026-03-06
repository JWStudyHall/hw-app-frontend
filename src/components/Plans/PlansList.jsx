import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getPlans } from "../../services/planService.js";

const PlansList = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const plansData = await getPlans();
      setPlans(plansData);
    };

    fetchPlans();
  }, []);

  if (!plans.length)
    return (
      <h1 style={{ textAlign: "center" }}>
        Let’s get moving! Create your first workout plan.
      </h1>
    );

  return (
    <>
      <div>
        <h1>{plans?.user?.username}'s Workout Plans</h1>
        <div></div>
      </div>
      ;
    </>
  );
};

export default PlansList;
