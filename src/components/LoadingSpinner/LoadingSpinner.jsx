import "./LoadingSpinner.css";

export const LoadingSpinner = ({ size = "md", fullPage = false }) => {

  return (
    <div 
      className={`loading-spinner ${fullPage ? "loading-spinner--full-page" : ""} loading-spinner--${size}`}
      role="status"
      aria-label="Loading"
    >
      <div className="loading-spinner__circle"></div>
      <span className="loading-spinner__text">Loading...</span>
    </div>
  );
};