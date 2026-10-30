import React from "react";
import "./Content.css";

// Reusable card for videos in the home and archive grids.
const Videos = ({ title, tbnl }) => {
  return (
    <div className="content media-content list">
      <img className="tbnl" src={tbnl} alt={title} />
      <h2 className="title">{title}</h2>
    </div>
  );
};

export default Videos;
