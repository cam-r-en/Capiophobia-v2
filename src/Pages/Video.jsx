import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../client";
import RichContent from "../Components/RichContent";
import "./Detail.css";

// Function to format the creation date
const formatDate = (date) => {
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);

  return `${formattedDate}`;
};

const Video = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching video:", error);
      } else {
        setVideo(data);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <>
      <div className="detail-page">
        <div className="c-intro">
          <Link to="/">
            <img id="chead-img" src="/imgs/Intro Badge.gif" alt="Intro Badge" />
          </Link>
          <nav className="detail-nav-actions" aria-label="Page navigation">
            <Link className="c-hnav-button" to="/">Home</Link>
            <Link className="c-hnav-button" to="/morevideos">
              See More
            </Link>
          </nav>
        </div>
        <article className="video-detail">
          <div className="video-detail-media">
            {video.vlink ? (
              <RichContent
                text={video.vlink}
                className="video-detail-player-content"
              />
            ) : (
              video.tbnl && (
                <img
                  className="video-detail-thumbnail"
                  src={video.tbnl}
                  alt={video.title}
                />
              )
            )}
          </div>
          <div className="video-detail-info">
            <h1 className="video-detail-title">{video.title}</h1>
            <p className="c-author">Sourced From: {video.creator}</p>
            <p className="c-creation">{formatDate(video.created_at)}</p>
            <RichContent text={video.desc} className="c-description" />
          </div>
        </article>
      </div>
    </>
  );
};

export default Video;
