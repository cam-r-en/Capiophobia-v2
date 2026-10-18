import React from "react";
import "./Content.css";

const Officers = ({ offname, offimg, offbio, detailed }) => {
  const imageUrl = typeof offimg === "string" ? offimg.trim() : "";

  return (
    <div className={`content ${detailed ? "detailed" : "list"}`}>
      {/* Always show title + thumbnail */}
      {imageUrl ? (
        <img className="pimg" src={imageUrl} alt={offname || "Officer"} />
      ) : (
        <div className="pimg-placeholder" aria-hidden="true">
          No image
        </div>
      )}
      <h2 className="pname">{offname || "Unnamed officer"}</h2>

      {/* Show extra stuff only in detail view */}
      {detailed && (
        <>
          <p className="pbio">by {offbio}</p>

        </>
      )}
    </div>
  );
};

export default Officers;