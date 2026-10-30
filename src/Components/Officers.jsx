import React from "react";
import "./Content.css";

// Reusable officer card used in library views.
const Officers = ({ offname, offimg }) => {
  const imageUrl = typeof offimg === "string" ? offimg.trim() : "";

  return (
    <div className="content people-content list">
      {/* Always show title + thumbnail */}
      <h2 className="pname">{offname}</h2>
      {imageUrl ? (
        <img className="pimg" src={imageUrl} alt={offname || "Officer"} />
      ) : (
        <div className="pimg-placeholder" aria-hidden="true">
          No image
        </div>
      )}
    </div>
  );
};

export default Officers;
