import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { useNavigate, useLocation } from "react-router";
import { signIn } from "../../services/authService.js";
import "./SignInForm.css";

const SignInForm = () => {
  const location = useLocation();

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  // useEffect to get error message from location state
  useEffect(() => {
    console.log("SignIn location.state:", location.state);
    const sessionMsg = location.state?.sessionExpiredMessage;
    if (sessionMsg) {
      setMessage(sessionMsg);
      sessionStorage.removeItem("sessionExpired");
    }
    else {
      setMessage("");
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage("");
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate("/app/explore");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1>Sign In</h1>
        {message && <p className="error-message">{message}</p>}
        <form
          className="signin-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn-submit">
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
