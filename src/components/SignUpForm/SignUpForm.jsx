import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../../services/authService.js";
import { UserContext } from "../../contexts/UserContext.jsx";
import "./SignUpForm.css";

const SignUpForm = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    passwordConf: ""
  });

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Destructure for easier use in the return
  const { username, password, passwordConf } = formData;

  const handleValidation = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" });
    if (name === "username" && value.length < 3) {
      setErrors((prevErrors) => ({ ...prevErrors, username: "Must be at least 3 characters long" }));
    }
    if (name === "password" && value.length < 8) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "Must be at least 8 characters long" }));
      if(formData.passwordConf!==value) {
        setErrors((prevErrors) => ({ ...prevErrors, passwordConf: "Passwords do not match" }));
      }
    }
    if (name === "passwordConf" && value !== password && value.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, passwordConf: "Passwords do not match" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage("");
    setFormData({ ...formData, [name]: value });
    handleValidation(e);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate("/explore");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Sign Up</h1>
        {/* Only show the error paragraph if there is actually a message */}
        {message && <p className="error-message">{message}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              name="username"
              onChange={handleChange}
              required
              minLength={3}
            />
            {errors.username && <p className="error-message">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={handleChange}
              required
              minLength={8}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              value={passwordConf}
              name="passwordConf"
              onChange={handleChange}
              required
              minLength={8}
            />
            {errors.passwordConf && <p className="error-message">{errors.passwordConf}</p>}
          </div>
          <div className="button-group">
            <button
              type="submit"
              className="btn-submit"
              disabled={isFormInvalid()}
            >
              Sign Up
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

export default SignUpForm;
