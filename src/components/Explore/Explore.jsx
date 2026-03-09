import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getExercises } from "../../services/exerciseService.js";
import { getTemplates } from "../../services/templateService.js";
import { getPlans } from "../../services/planService.js";

const Explore = () => {
  const [featuredExercises, setFeaturedExercises] = useState([]);
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [featuredPlans, setFeaturedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExploreData = async () => {
      setLoading(true);
      setError("");

      try {
        const [exercisesData, templatesData, plansData] = await Promise.all([
          getExercises(),   // all workouts for the current user
          getTemplates("public"),  // all templates (you can later filter by is_public if needed)
          getPlans("public"),      // all plans (we'll filter to public below)
        ]);

        // Recent Workouts: sort by start_dt (or created_at as fallback), take top 3
        const exercises = Array.isArray(exercisesData) ? exercisesData : [];
        setFeaturedExercises(exercises.slice(0, 3));

        // Featured Templates: latest templates (top 3)
        const templates = Array.isArray(templatesData) ? templatesData : [];
        const sortedTemplates = [...templates].sort((a, b) => {
          const aDate = new Date(a.created_at || 0);
          const bDate = new Date(b.created_at || 0);
          return bDate - aDate;
        });
        setFeaturedTemplates(sortedTemplates.slice(0, 3));

        // Featured Plans: public plans only, latest first (top 3)
        const plans = Array.isArray(plansData) ? plansData : [];
        const publicPlans = plans.filter((p) => p.is_public);
        const sortedPlans = [...publicPlans].sort((a, b) => {
          const aDate = new Date(a.created_at || a.start_dt || 0);
          const bDate = new Date(b.created_at || b.start_dt || 0);
          return bDate - aDate;
        });
        setFeaturedPlans(sortedPlans.slice(0, 3));
      } catch (err) {
        console.error("Error loading explore data:", err);
        setError("Could not load Explore content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "20px" }}>
        <h2>Explore</h2>
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "20px" }}>
        <h2>Explore</h2>
        <p style={{ color: "crimson" }}>{error}</p>
      </main>
    );
  }

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "100vw", margin: "0 1rem" }}>
      <h2>Explore</h2>
      <p>Jump back into your training or discover new ideas.</p>

      {/* Featured Exercises */}
      <section style={{ marginTop: "24px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "8px",
          }}
        >
          <h3 style={{ margin: 0 }}>Featured Exercises</h3>
          <Link to="/exercises" style={{ fontSize: "0.9rem" }}>
            View all exercises
          </Link>
        </header>

        {featuredExercises.length === 0 ? (
          <p>No exercises yet. Create an exercise or make it public to share.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {featuredExercises.map((exercise) => (
              <article
                key={exercise.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "0.75rem",
                }}
              >
                <h4 style={{ margin: "0 0 0.25rem 0" }}>
                  <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                  {exercise.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Featured Templates */}
      <section style={{ marginTop: "32px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "8px",
          }}
        >
          <h3 style={{ margin: 0 }}>Featured Templates</h3>
          <Link to="/templates?scope=public" style={{ fontSize: "0.9rem" }}>
            View all templates
          </Link>
        </header>

        {featuredTemplates.length === 0 ? (
          <p>No templates yet. Create one to reuse your favorite sessions.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {featuredTemplates.map((template) => (
              <article
                key={template.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "0.75rem",
                }}
              >
                <h4 style={{ margin: "0 0 0.25rem 0" }}>
                  <Link to={`/templates/${template.id}`}>{template.title}</Link>
                </h4>
                {template.description && (
                  <p
                    style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    {template.description}
                  </p>
                )}
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#777" }}>
                  {template.duration
                    ? `${template.duration} min template`
                    : "Template"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Featured Plans */}
      <section style={{ marginTop: "32px", marginBottom: "16px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "8px",
          }}
        >
          <h3 style={{ margin: 0 }}>Featured Plans</h3>
          <Link to="/plans?scope=public" style={{ fontSize: "0.9rem" }}>
            View all plans
          </Link>
        </header>

        {featuredPlans.length === 0 ? (
          <p>No public plans yet. Create a plan or make one public to share.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {featuredPlans.map((plan) => (
              <article
                key={plan.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "0.75rem",
                }}
              >
                <h4 style={{ margin: "0 0 0.25rem 0" }}>
                  <Link to={`/plans/${plan.id}`}>{plan.title}</Link>
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                  Starts: {formatDateTime(plan.start_dt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Explore;