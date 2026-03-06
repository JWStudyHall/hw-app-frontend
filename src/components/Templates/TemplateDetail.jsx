import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { getTemplate } from "../../services/templateService.js";
import { UserContext } from "../../contexts/UserContext.jsx";

const TemplateDetail = () => {
  const [template, setTemplate] = useState(null);
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const fetchTemplate = async () => {
    const fetchedTemplate = await getTemplate(templateId);
    setTemplate(fetchedTemplate);
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  function createExerciseBlurb(item) {
    let ret = "";
    if (item.sets && item.sets > 0) {
      ret += item.sets;
      if (item.reps && item.reps > 0) {
        ret += " x " + item.reps;
      }
      if (item.weight && item.weight_unit) {
        ret += " @ " + item.weight + " " + item.weight_unit;
      }
    }

    if (item.distance) {
      ret += (ret ? " • " : "") + item.distance + "m";
    }

    if (item.duration) {
      ret += (ret ? " • " : "") + item.duration + "s";
    }

    return ret || "No prescription specified";
  }

  if (!template) return <h3>Loading...</h3>;

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: "1px solid #ddd",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                margin: "0 0 8px 0",
              }}
            >
              {template.title}
            </h2>
            {template.duration && (
              <p
                style={{
                  margin: 0,
                  color: "#555",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Duration: {template.duration} min
              </p>
            )}
          </div>
          {user?.id === template.user && (
          <button
            onClick={() => navigate(`/templates/${templateId}/edit`)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1976D2";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#2196F3";
            }}
          >
            Edit Template
          </button>
          )}
        </div>

        {template.description && (
          <p
            style={{
              marginTop: "0",
              marginBottom: "8px",
              color: "#444",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {template.description}
          </p>
        )}

        <p
          style={{
            margin: 0,
            color: "#777",
            fontSize: "13px",
          }}
        >
          {template.items?.length || 0} exercise
          {template.items?.length === 1 ? "" : "s"}
        </p>
      </div>

      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          Exercises
        </h3>

        {(!template.items || template.items.length === 0) && (
          <p style={{ color: "#777", fontSize: "14px" }}>
            No exercises have been added to this template yet.
          </p>
        )}

        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {template.items.map((item, index) => (
            <li
              key={item.id || index}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#888",
                      fontWeight: "500",
                    }}
                  >
                    #{index + 1}
                  </span>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {item.exercise_detail?.name || "Exercise"}
                  </h4>
                </div>
              </div>

              <p
                style={{
                  margin: "6px 0 4px 0",
                  color: "#333",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {createExerciseBlurb(item)}
              </p>

              {item.notes && (
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: "#555",
                    fontSize: "13px",
                    borderTop: "1px solid #eee",
                    paddingTop: "6px",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>Notes:</span> {item.notes}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default TemplateDetail;