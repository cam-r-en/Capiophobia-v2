import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import LoadingIndicator from "../Components/LoadingIndicator";
import Articles from "../Components/Articles"; // assuming this is your component for rendering a video
import { Link } from "react-router-dom";
import "./Library.css";

const ArtLibrary = () => {
  const [arts, setArts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchArts = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        setErrorMessage("Articles could not be loaded. Please try again later.");
      } else {
        setArts(data || []);
      }
      setIsLoading(false);
    };

    fetchArts();
  }, []);

  return (
    <>
      <div className="intro">
        <img
          id="shead-img"
          src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`}
          alt="Intro Badge"
        />
        <h1>Articles</h1>
        <Link to="/" className="hnav-button">
          &larr; Main Page
        </Link>
      </div>
      <div className="page">
        <div className="ReadCon">
          {isLoading ? (
            <LoadingIndicator label="Loading articles" />
          ) : errorMessage ? (
            <p role="alert">{errorMessage}</p>
          ) : arts.length === 0 ? (
            <p>No articles have been added yet.</p>
          ) : (
            arts.map((art) => (
              <Link to={`/article/${art.id}`}>
                <Articles
                  key={art.id}
                  id={art.id}
                  title={art.title}
                  tbnl={art.tbnl}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ArtLibrary;
