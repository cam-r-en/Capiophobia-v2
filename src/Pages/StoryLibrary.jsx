import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";
import LoadingIndicator from "../Components/LoadingIndicator";
import "./StoryLibrary.css";

const getStoryAttribution = (user) => {
  const name = user?.trim();
  return name && name.toLowerCase() !== "anonymous"
    ? `Shared by ${name}`
    : "Shared Anonymously";
};

const StoryLibrary = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const fetchStories = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("id, user, written, created_at")
        .eq("is_posted", true)
        .order("created_at", { ascending: false });

      if (!isCurrent) return;

      if (error) {
        console.error("Error fetching published stories:", error);
        setErrorMessage("Stories could not be loaded. Please try again later.");
      } else {
        setStories(data || []);
      }

      setIsLoading(false);
    };

    fetchStories();
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <main className="community-stories-page">
      <header className="community-stories-header">
        <Link to="/" aria-label="Return to home">
          <img src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`} alt="" />
        </Link>
        <h1>Community Stories</h1>
        <nav className="community-stories-actions" aria-label="Page actions">
          <Link className="community-stories-action" to="/submit-story">
            Submit a story
          </Link>
          <Link className="community-stories-action" to="/">
            Home
          </Link>
        </nav>
      </header>

      <section className="community-stories-list" aria-live="polite">
        {isLoading && <LoadingIndicator label="Loading stories" />}
        {!isLoading && errorMessage && (
          <p className="community-stories-error" role="alert">
            {errorMessage}
          </p>
        )}
        {!isLoading && !errorMessage && stories.length === 0 && (
          <p>No stories have been approved for posting yet.</p>
        )}
        {!isLoading &&
          !errorMessage &&
          stories.map((story) => (
            <Link
              className="community-story"
              to={`/story/${story.id}`}
              key={story.id}
              aria-label={`Read story. ${getStoryAttribution(story.user)}`}
            >
              <h2>{getStoryAttribution(story.user)}</h2>
              <p className="community-story-text">{story.written}</p>
              {story.created_at && (
                <time dateTime={story.created_at}>
                  {new Date(story.created_at).toLocaleDateString()}
                </time>
              )}
            </Link>
          ))}
      </section>
    </main>
  );
};

export default StoryLibrary;
