import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client";
import LoadingIndicator from "../Components/LoadingIndicator";
import RichContent from "../Components/RichContent";
import "./Story.css";

// Community story detail page: shows approved stories and any uploaded attachments/links.
// The story is filtered to is_posted = false so unpublished drafts never appear publicly.
const getStoryAttribution = (user) => {
  const name = user?.trim();
  return name && name.toLowerCase() !== "anonymous"
    ? `Shared by ${name}`
    : "Shared Anonymously";
};

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
        .select("id, user, written, created_at, file_name, file_url, links")
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

  const attachments =
    story && Array.isArray(story.file_url)
      ? story.file_url.flatMap((url, index) => {
          if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
            return [];
          }

          const name = story.file_name?.[index] || `Attachment ${index + 1}`;

          return [
            {
              name,
              url,
              isImage: /\.(avif|bmp|gif|jpe?g|png|webp)$/i.test(name),
            },
          ];
        })
      : [];
  const storyLinks = Array.isArray(story?.links)
    ? story.links.filter(
        (url) => typeof url === "string" && /^https?:\/\//i.test(url.trim()),
      )
    : [];

  return (
    <main className="story-page">
      <header className="story-page-header">
        <Link to="/" aria-label="Return to home">
          <img src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`} alt="" />
        </Link>
        <h1>Community Story</h1>
        <Link className="story-page-action" to="/morestories">
          All Stories
        </Link>
      </header>

      <section className="story-page-content">
        <article className="story-detail-card">
          {isLoading && <LoadingIndicator label="Loading story" />}
          {!isLoading && hasError && (
            <p className="story-page-error" role="alert">
              This story could not be loaded. Please try again later.
            </p>
          )}
          {!isLoading && !hasError && notFound && (
            <p>This story does not exist.</p>
          )}
          {!isLoading && story && (
            <>
              <h2>{getStoryAttribution(story.user)}</h2>
              <p>{story.written}</p>
              {story.created_at && (
                <time dateTime={story.created_at}>
                  {new Date(story.created_at).toLocaleDateString()}
                </time>
              )}
              {attachments.length > 0 && (
                <section className="story-attachments" aria-label="Attachments">
                  <h3>Attachments</h3>
                  <ul>
                    {attachments.map((attachment) => (
                      <li
                        className={
                          attachment.isImage
                            ? "story-image-attachment"
                            : undefined
                        }
                        key={attachment.url}
                      >
                        {attachment.isImage && (
                          <a
                            className="story-attachment-preview-link"
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open image ${attachment.name}`}
                          >
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              loading="lazy"
                            />
                          </a>
                        )}
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {attachment.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {storyLinks.length > 0 && (
                <section className="story-links" aria-label="Shared links">
                  <h3>Links</h3>
                  <RichContent text={storyLinks.join("\n\n")} />
                </section>
              )}
            </>
          )}
        </article>
      </section>
      {/* Footer Section */}
      <div className="footer-container">
        <div className="socials">
          <a
            href="https://github.com/cam-r-en"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
              alt="GitHub"
            />
          </a>
          <a href="https://x.com/CAM_R_EN" target="_blank" rel="noreferrer">
            <img
              src="https://pngimg.com/uploads/x_logo/x_logo_PNG19.png"
              alt="X_Twitter"
            />
          </a>
          <a
            href="https://www.instagram.com/dgtlwb.cam/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://assets.streamlinehq.com/image/private/w_240,h_240,ar_1/f_auto/v1/icons/logo/instagram-logo-i8m1gphmzwyfw22g0xdy.png/instagram-logo-52glddxszoh3pbwuo3z8fd.png?_a=DATAiZAAZAA0"
              alt="Instagram"
            />
          </a>
          <a
            href="https://www.tiktok.com/@oneextracam"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/016/716/450/small_2x/tiktok-icon-free-png.png"
              alt="TikTok"
            />
          </a>
          <a
            href="https://www.youtube.com/@dgtlwebCam"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/c4/logo-youtube-9uz0vchu8rnpddaet2viom.png/logo-youtube-x5qkxw19tzce323872cxy5.png?_a=DATAiZAAZAA0"
              alt="YouTube"
            />
          </a>
        </div>
      </div>
    </main>
  );
};

export default Story;
