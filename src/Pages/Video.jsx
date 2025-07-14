import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../client";
import "./All.css";

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
        <div className="video-detail-card">
          <div className="intro">
            <h1>{video.title}</h1>
            {video.tbnl && (
              <img src={video.tbnl} alt={video.title} className="video-image" />
            )}
            <p>
              <strong>Sourced From: </strong> {video.creator}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(video.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="desc-content">
            <p>{video.desc}</p>
          </div>
          <div className="link">
            <p>{video.link}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
