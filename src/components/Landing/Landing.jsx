import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      <main className="landing-content">
        <span className="brand-tag">The Future of Fitness</span>

        <h1>
          Health is <br />
          <span>Wealth.</span>
        </h1>

        <p>
          The Modern way to track your workouts, manage your diet, and build a
          body that lasts a lifetime.
        </p>

        <div className="cta-group">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Sign In</button>
        </div>
      </main>
    </div>
  );
};

export default Landing;
