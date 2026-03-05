import React from "react";
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
  }, [])

  if (!plans.length) return <h1 style= 

  return <div>PlansList</div>;
};

export default PlansList;
