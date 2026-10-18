import React from "react";
import "./Content.css";

const formatDate = (date) => {
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);

  const hours = new Date(date).getHours();
  const minutes = new Date(date).getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
};

const Articles = ({ title, tbnl, author, essay, vlink, created_at, detailed }) => {
  return (
    <div className={`content ${detailed ? "detailed" : "list"}`}>
      {/* Always show title + thumbnail */}
      <img className="tbnl" src={tbnl} alt={title} />
      <h2 className="title">{title}</h2>

      {/* Show extra stuff only in detail view */}
      {detailed && (
        <>
          <h3 className="author">by {author}</h3>
          <p className="desc">{essay}</p>

          {vlink && (
            <a
              href={vlink}
              target="_blank"
              rel="noopener noreferrer"
              className="vlink"
            >
              Watch on YouTube
            </a>
          )}

          {created_at && (
            <p className="created-at">Created at: {formatDate(created_at)}</p>
          )}
        </>
      )}
    </div>
  );
};

export default Articles;
