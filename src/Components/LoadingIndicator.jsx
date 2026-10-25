import React from "react";
import "./LoadingIndicator.css";

const LoadingIndicator = ({ label = "Loading" }) => (
  <div className="loading-indicator" role="status" aria-label={label}>
    <span className="loading-indicator-dots" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  </div>
);

export default LoadingIndicator;
