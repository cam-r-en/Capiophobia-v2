import React from "react";
import "./Content.css";

const Victims = ({ vicname, vicimg }) => {
  const imageUrl = typeof vicimg === "string" ? vicimg.trim() : "";

  return (
    <div className="content people-content list">
      {/* Always show title + thumbnail */}
      <h2 className="pname">{vicname}</h2>
      {imageUrl ? (
        <img className="pimg" src={imageUrl} alt={vicname || "Victim"} />
      ) : (
        <div className="pimg-placeholder" aria-hidden="true">
          No image
        </div>
      )}
    </div>
  );
};

export default Victims;