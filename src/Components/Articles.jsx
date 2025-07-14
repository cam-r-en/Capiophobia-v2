import React from "react";
import "./Content.css";

const Articles = (props) => {
  return (
    <div className="content">
      <img src={props.tbnl} alt={props.title} className="art-img" />
      <h2 className="vlink">{props.vlink}</h2>
      <h3 className="desc">{props.essay}</h3>
      <h5 className="author">{props.author}</h5>
      <p className="title">{props.title}</p>
    </div>
  );
};

export default Articles;
