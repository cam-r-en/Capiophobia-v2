import React from "react";
import "./Content.css";

// Reusable card for article listings inside the library pages.
const Articles = ({ title, tbnl }) => {
  return (
    <div className="content media-content list">
      <img className="tbnl" src={tbnl} alt={title} />
      <h2 className="title">{title}</h2>
    </div>
  );
};

export default Articles;
