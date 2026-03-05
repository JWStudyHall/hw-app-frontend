import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getPlan,
  deletePlan,
  addTemplateToPlan,
  removeTemplateFromPlan,
} from "../../services/planService";

const PlanDetail = () => {
  const [planDetail, setPlanDetail] = useState(null);
  const [toggle, setToggle] = useState(false);

  let { planId } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      const planData = await getPlan(planId);
      setPlanDetail(planData);
    };
    fetchPlan();
  }, [planId, toggle]);

  const handleDelete = async () => {
    await deletePlan(planId);
    navigate("/");
  };
  const handleAddTemplateToPlan = async (templateId) => {
    await addTemplateToPlan(planId, templateId);
    setToggle((prev) => !prev);
  };
  const handleRemoveTemplateFromPlan = async (templateId) => {
    await removeTemplateFromPlan(planId, templateId);
    setToggle((prev) => !prev);
  };

  return (
  <>
    <div>
      <h2>My Plan</h2>
      <p>Exercises, imgs, details etc.</p>
    </div>

    <div>
        <Link to ={`/workout-plans/${planDetail?.plan?.Id}/edit`}>
        <button>Edit</button>
        </Link>
        <button onClick={handleDelete}>Delete</button>
    </div>

  </>
)
};

export default PlanDetail;
