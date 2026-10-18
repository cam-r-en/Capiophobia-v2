import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client";
import "./Story.css";

const Story = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const fetchStory = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("id, user, written, created_at")
        .eq("id", id)
        .eq("is_posted", true)
        .maybeSingle();

      if (!isCurrent) return;

      if (error) {
        console.error("Error fetching community story:", error);
        setHasError(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setStory(data);
      }

      setIsLoading(false);
    };

    fetchStory();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  return (
    <main className="story-page">
      <header className="story-page-header">
        <Link to="/" aria-label="Return to home">
          <img src="/imgs/Intro Badge.gif" alt="" />
        </Link>
        <h1>Community Story</h1>
        <Link className="story-page-action" to="/morestories">
          All Stories
        </Link>
      </header>

      <section className="story-page-content">
        <article className="story-detail-card">
          {isLoading && <p>Loading story...</p>}
          {!isLoading && hasError && (
            <p className="story-page-error" role="alert">
              This story could not be loaded. Please try again later.
            </p>
          )}
          {!isLoading && !hasError && notFound && (
            <p>
              This story does not exist.
            </p>
          )}
          {!isLoading && story && (
            <>
              <h2>Shared by {story.user || "Anonymous"}</h2>
              <p>{story.written}</p>
              {story.created_at && (
                <time dateTime={story.created_at}>
                  {new Date(story.created_at).toLocaleDateString()}
                </time>
              )}
            </>
          )}
        </article>
      </section>
    </main>
  );
};

export default Story;
