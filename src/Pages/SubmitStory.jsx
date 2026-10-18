import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";
import "./SubmitStory.css";

const SubmitStory = () => {
  const [userName, setUsername] = useState("");
  const [story, setStory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.from("stories").insert({
        user: userName.trim() || "Anonymous",
        written: story.trim(),
      });

      if (error) {
        console.error("Error submitting story:", error);
        setErrorMessage(
          "Your story could not be submitted. Please try again later.",
        );
        return;
      }

      setIsSubmitted(true);
      setUsername("");
      setStory("");
    } catch (error) {
      console.error("Unexpected error submitting story:", error);
      setErrorMessage(
        "Your story could not be submitted. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="submit-story-page">
      <header className="submit-story-header">
        <Link to="/" aria-label="Return to home">
          <img src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`} alt="" />
        </Link>
        <h1>Submit Your Story</h1>
        <Link className="submit-story-home" to="/">
          Home
        </Link>
      </header>

      <section className="submit-story-content">
        <p>
          Share your story for review. Submissions are not published unless
          reviewed and approved.
        </p>

        {isSubmitted ? (
          <div className="submit-story-success" role="status">
            Thank you. Your story was submitted for review.
          </div>
        ) : (
          <form className="submit-story-form" onSubmit={handleSubmit}>
            <label htmlFor="story-author">Your name (optional)</label>
            <input
              id="story-author"
              name="authorName"
              type="text"
              autoComplete="name"
              maxLength={80}
              value={userName}
              onChange={(event) => setUsername(event.target.value)}
            />

            <label htmlFor="story-text">Your story</label>
            <textarea
              id="story-text"
              name="story"
              rows={12}
              maxLength={20000}
              required
              value={story}
              onChange={(event) => setStory(event.target.value)}
            />

            {errorMessage && (
              <p className="submit-story-error" role="alert">
                {errorMessage}
              </p>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit for review"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default SubmitStory;
