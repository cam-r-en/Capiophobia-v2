import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import Articles from "../Components/Articles"; // assuming this is your component for rendering a video
import { Link } from "react-router-dom";
import "./Library.css";

const ArtLibrary = () => {
  const [arts, setArts] = useState([]);

  useEffect(() => {
    const fetchArts = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching videos:", error);
      } else {
        setArts(data);
      }
    };

    fetchArts();
  }, []);

  return (
    <>
      <div className="page">
        <div className="intro">
          <img id="shead-img" src="imgs/Intro Badge.gif" alt="Intro Badge" />
          <h1>Media News</h1>
          <Link to="/" className="hnav-button">
            &larr; Main Page
          </Link>
        </div>

        <div className="ReadCon">
          {arts.length === 0 ? (
            <p>Loading...</p>
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
