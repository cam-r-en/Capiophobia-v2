import React from "react";
import "./Content.css";

const Victims = ({ vicname, vicimg, vicbio, detailed }) => {
  const imageUrl = typeof vicimg === "string" ? vicimg.trim() : "";

  return (
    <div className={`content ${detailed ? "detailed" : "list"}`}>
      {/* Always show title + thumbnail */}
      {imageUrl ? (
        <img className="pimg" src={imageUrl} alt={vicname || "Victim"} />
      ) : (
        <div className="pimg-placeholder" aria-hidden="true">
          No image
        </div>
      )}
      <h2 className="pname">{vicname || "Unnamed victim"}</h2>

      {/* Show extra stuff only in detail view */}
      {detailed && (
        <>
          <p className="pbio">by {vicbio}</p>

        </>
      )}
    </div>
  );
};

export default Victims;