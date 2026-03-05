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

  if (!plans.length) return <h1>Please Make a Plan</h1>;

  return <div>PlansList</div>;
};

export default PlansList;
