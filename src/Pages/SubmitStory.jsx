import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";
import "./SubmitStory.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedFileExtensions = new Set([
  "avif",
  "bmp",
  "doc",
  "docx",
  "jpeg",
  "jpg",
  "pdf",
  "png",
  "webp",
]);
const acceptedFileTypes = ".avif,.bmp,.doc,.docx,.jpeg,.jpg,.pdf,.png,.webp";

const formatSubmissionError = (error) => {
  const message =
    error instanceof Error ? error.message : "An unknown error occurred.";
  const code =
    error && typeof error === "object" && "code" in error
      ? ` (code: ${error.code})`
      : "";

  return `${message}${code}`;
};

const SubmitStory = () => {
  const [userName, setUsername] = useState("");
  const [story, setStory] = useState("");
  const [links, setLinks] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const invalidFile = files.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return (
        !extension ||
        !allowedFileExtensions.has(extension) ||
        file.size > MAX_FILE_SIZE
      );
    });

    if (invalidFile) {
      setSelectedFiles([]);
      event.target.value = "";
      setErrorMessage(
        invalidFile.size > MAX_FILE_SIZE
          ? `${invalidFile.name} exceeds the 10 MB per-file limit.`
          : `${invalidFile.name} is not an accepted file type.`,
      );
      return;
    }

    setErrorMessage("");
    setSelectedFiles(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const submittedLinks = links
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);
    const normalizedLinks = [];

    for (const value of submittedLinks) {
      try {
        const parsedUrl = new URL(value);
        if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
          throw new Error("Only HTTP and HTTPS links are allowed.");
        }
        normalizedLinks.push(parsedUrl.href);
      } catch {
        setErrorMessage(
          `Please enter a valid URL beginning with https:// or http://: ${value}`,
        );
        return;
      }
    }

    setIsSubmitting(true);

    const uploadedPaths = [];
    const uploadedFiles = [];

    try {
      for (const file of selectedFiles) {
        const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `user-files/${crypto.randomUUID()}-${safeFileName}`;
        const { data, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, file, {
            cacheControl: "3600",
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            `Could not upload ${file.name}: ${uploadError.message}`,
          );
        }

        uploadedPaths.push(data.path);
        const { data: publicUrlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(data.path);

        uploadedFiles.push({
          name: file.name,
          url: publicUrlData.publicUrl,
        });
      }

      const { error: insertError } = await supabase.from("stories").insert({
        user: userName.trim() || "Anonymous",
        written: story.trim(),
        file_name: uploadedFiles.map((file) => file.name),
        file_url: uploadedFiles.map((file) => file.url),
        links: normalizedLinks,
        is_posted: false,
      });

      if (insertError) {
        throw new Error(`Could not save story: ${insertError.message}`);
      }

      setIsSubmitted(true);
      setUsername("");
      setStory("");
      setLinks("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error submitting story and attachments:", error);

      if (uploadedPaths.length > 0) {
        const { error: cleanupError } = await supabase.storage
          .from("uploads")
          .remove(uploadedPaths);

        if (cleanupError) {
          console.error(
            "Could not clean up uploaded story files:",
            cleanupError,
          );
        }
      }

      setErrorMessage(
        `Your story could not be submitted: ${formatSubmissionError(error)}. Check the Supabase Storage INSERT policy for the uploads bucket and the stories table INSERT policy.`,
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
          All submitted stories are reviewed before being approved for publish.
        </p>

        {isSubmitted ? (
          <div className="submit-story-success" role="status">
            Thank you. Your story and attachments were submitted for review.
          </div>
        ) : (
          <form className="submit-story-form" onSubmit={handleSubmit}>
            <label htmlFor="story-author">Your Name (leave blank to submit anonymously)</label>
            <input
              id="story-author"
              name="authorName"
              type="text"
              autoComplete="name"
              maxLength={80}
              value={userName}
              onChange={(event) => setUsername(event.target.value)}
            />

            <label htmlFor="story-text">Your Story</label>
            <textarea
              id="story-text"
              name="story"
              rows={12}
              maxLength={20000}
              required
              value={story}
              onChange={(event) => setStory(event.target.value)}
            />

            <label htmlFor="story-links">Links (optional)</label>
            <textarea
              id="story-links"
              name="links"
              rows={3}
              value={links}
              aria-describedby="story-links-help"
              onChange={(event) => setLinks(event.target.value)}
              placeholder="https://example.com"
            />
            <p id="story-links-help" className="submit-story-file-help">
              Add one link per line. Links must begin with http:// or https://.
            </p>

            <label htmlFor="story-files">Attachments (optional)</label>
            <input
              id="story-files"
              name="files"
              type="file"
              accept={acceptedFileTypes}
              multiple
              aria-describedby="story-files-help"
              onChange={handleFileChange}
            />
            <p id="story-files-help" className="submit-story-file-help">
              Add images or common documents (up to 10 MB each). Selected files
              will be visible when your story is approved.
            </p>
            <p id="story-files-help" className="submit-story-file-help">
              <i>
                Accepted File Types: avif, bmp, doc, docx, jpeg, jpg, pdf, png,
                webp
              </i>
            </p>
            {selectedFiles.length > 0 && (
              <ul
                className="submit-story-file-list"
                aria-label="Selected files"
              >
                {selectedFiles.map((file) => (
                  <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                    {file.name}
                  </li>
                ))}
              </ul>
            )}

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
