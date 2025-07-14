import React from "react";
import "./Content.css";

const Videos = (props) => {
  return (
    <div className="content">
      <img src={props.tbnl} alt={props.title} className="vid-img"/>
      <a
        href={props.vlink}
        className="vlink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.creator}
      </a>
      <h1 className="title">{props.title}</h1>
      <p className="desc">{props.desc}</p>
      {/* Optional: Only show if props.creator exists */}
    </div>
  );
};

export default Videos;
