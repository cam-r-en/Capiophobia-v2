import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import Videos from "../Components/Videos"; // assuming this is your component for rendering a video
import { Link } from "react-router-dom";
import "./Library.css";

const VidLibrary = () => {
  const [vids, setVids] = useState([]);

  useEffect(() => {
    const fetchVids = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching videos:", error);
      } else {
        setVids(data);
      }
    };

    fetchVids();
  }, []);

  return (
    <>
      <div className="intro">
        <img id="shead-img" src="/imgs/Intro Badge.gif" alt="Intro Badge" />
        <h1>Video Archives</h1>
        <Link to="/" className="hnav-button">
          &larr; Main Page
        </Link>
      </div>
      <div className="page">
        <div className="ReadCon">
          {vids.length === 0 ? (
            <p>Loading...</p>
          ) : (
            vids.map((vid) => (
              <Link to={`/video/${vid.id}`}>
                <Videos
                  key={vid.id}
                  id={vid.id}
                  title={vid.title}
                  tbnl={vid.tbnl}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default VidLibrary;
