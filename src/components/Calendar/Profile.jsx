import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
  getProfile,
  updateHeight,
  getWeightLogs,
  createWeightLog,
} from "../../services/profileServices.js";

const Profile = () => {
  const { user } = useContext(UserContext);

  const [height, setHeight] = useState(null);
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [editingHeight, setEditingHeight] = useState(false);

  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");

  const [weightLogs, setWeightLogs] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const profile = await getProfile(user.id);
      setHeight(profile.height);

      if (profile.height) {
        setFeet(Math.floor(profile.height / 12));
        setInches(profile.height % 12);
      }

      const logs = await getWeightLogs(user.id);
      setWeightLogs(logs);
    };

    if (user) loadData();
  }, [user]);

  const handleHeightSubmit = async (e) => {
    e.preventDefault();

    const totalInches = Number(feet) * 12 + Number(inches);

    const updated = await updateHeight(user.id, totalInches);
    setHeight(updated.height);
    setEditingHeight(false);
  };

  const handleWeightSubmit = async (e) => {
    e.preventDefault();

    const newEntry = await createWeightLog({
      user: user?.id,
      weight,
      date,
    });

    setWeightLogs((prev) => [...prev, newEntry]);
    setWeight("");
    setDate("");
  };

  const latestWeight =
    weightLogs.length > 0 ? weightLogs[weightLogs.length - 1] : null;

  const formattedHeight = height
    ? `${Math.floor(height / 12)}'${height % 12}"`
    : "Not set";

  return (
    <div>
      <h1>Profile</h1>

      <h2>{user?.username}</h2>

      <div>
        <h3>Height</h3>

        {height && !editingHeight && (
          <div>
            <p>{formattedHeight}</p>
            <button onClick={() => setEditingHeight(true)}>Edit</button>
          </div>
        )}

        {(!height || editingHeight) && (
          <form onSubmit={handleHeightSubmit}>
            <label>Feet</label>
            <input
              type="number"
              min="0"
              value={feet}
              onChange={(e) => setFeet(e.target.value)}
            />

            <label>Inches</label>
            <input
              type="number"
              min="0"
              max="11"
              value={inches}
              onChange={(e) => setInches(e.target.value)}
            />

            <button type="submit">Save Height</button>
          </form>
        )}
      </div>

      <div>
        <h3>Current Weight</h3>

        {latestWeight ? (
          <p>
            {latestWeight.weight} lbs (as of {latestWeight.date})
          </p>
        ) : (
          <p>Log your weight!</p>
        )}
      </div>

      <form onSubmit={handleWeightSubmit}>
        <h3>Log Weight</h3>

        <label>Weight</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <label>As of Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit" disabled={!weight || !date}>
          Save Weight
        </button>
      </form>

      {weightLogs.length > 1 && (
        <button onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide History" : "Show Weight History"}
        </button>
      )}

      {showHistory && (
        <div>
          <h3>Weight History</h3>

          {weightLogs.map((entry) => (
            <div key={entry.id}>
              <p>
                {entry.weight} lbs — {entry.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;