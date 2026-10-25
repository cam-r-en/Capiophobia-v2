import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import LoadingIndicator from "../Components/LoadingIndicator";
import Videos from "../Components/Videos";
import { Link } from "react-router-dom";
import "./Library.css";

const VidLibrary = () => {
  const [vids, setVids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVids = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching videos:", error);
        setErrorMessage("Videos could not be loaded. Please try again later.");
      } else {
        setVids(data || []);
      }
      setIsLoading(false);
    };

    fetchVids();
  }, []);

  return (
    <>
      <div className="intro">
        <img
          id="shead-img"
          src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`}
          alt="Intro Badge"
        />
        <h1>Video Archives</h1>
        <Link to="/" className="hnav-button">
          &larr; Main Page
        </Link>
      </div>
      <div className="page">
        <div className="ReadCon">
          {isLoading ? (
            <LoadingIndicator label="Loading videos" />
          ) : errorMessage ? (
            <p role="alert">{errorMessage}</p>
          ) : vids.length === 0 ? (
            <p>No videos have been added yet.</p>
          ) : (
            vids.map((vid) => (
              <Link to={`/video/${vid.id}`}>
                <Videos
                  key={vid.id}
                  id={vid.id}
                  tbnl={vid.tbnl}
                  title={vid.title}
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
