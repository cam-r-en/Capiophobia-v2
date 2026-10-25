import React, { useEffect, useRef } from "react";
import "./RichContent.css";

// Match links in text while excluding common sentence-ending punctuation.
const urlPattern = /https?:\/\/[^\s<>"')]+/gi;
const inlineTokenPattern =
  /\[[^\]\n]+\]\(https?:\/\/[^)\s]+\)|\*\*[^*\n]+\*\*|\*[^*\n]+\*|https?:\/\/[^\s<>"']+/gi;
const markdownLinkPattern = /^\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)$/;
const trailingPunctuationPattern = /[.,!?;:)\]}]+$/;
const imageExtensionPattern = /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i;
const youtubeIdPattern = /^[\w-]{11}$/;
const socialPostIdPattern = /^\d+$/;
let xWidgetsPromise;

// Each provider converts its supported share URL into a safe embed URL.
const embedProviders = [
  {
    name: "YouTube",
    getEmbedUrl(url) {
      const host = url.hostname.replace(/^www\./, "");
      let videoId = null;

      if (host === "youtu.be") {
        videoId = url.pathname.split("/").filter(Boolean)[0];
      } else if (
        host === "youtube.com" ||
        host === "m.youtube.com" ||
        host === "youtube-nocookie.com"
      ) {
        if (url.pathname === "/watch") {
          videoId = url.searchParams.get("v");
        } else if (/^\/(embed|shorts|live)\//.test(url.pathname)) {
          videoId = url.pathname.split("/")[2];
        }
      }

      return videoId && youtubeIdPattern.test(videoId)
        ? {
            url: `https://www.youtube-nocookie.com/embed/${videoId}`,
            aspectRatio: /^\/shorts\//.test(url.pathname) ? "9 / 16" : "16 / 9",
          }
        : null;
    },
  },
  {
    name: "Instagram",
    getEmbedUrl(url) {
      const host = url.hostname.replace(/^www\./, "");
      const match = url.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);

      return host === "instagram.com" && match
        ? {
            url: `https://www.instagram.com/${match[1]}/${match[2]}/embed`,
            aspectRatio: match[1] === "reel" ? "9 / 16" : null,
          }
        : null;
    },
  },
  {
    name: "Facebook",
    getEmbedUrl(url) {
      const host = url.hostname.replace(/^(www|m|web)\./, "");
      const path = url.pathname;

      if (host !== "facebook.com" && host !== "fb.watch") {
        return null;
      }

      const isVideo =
        host === "fb.watch" ||
        /(?:^|\/)(?:videos?|reel|watch|share\/v)(?:\/|$)/i.test(path);
      const isPost =
        /\/(?:posts|permalink|share\/p)\//i.test(path) ||
        /\/(?:story|photo)\.php$/i.test(path) ||
        url.searchParams.has("story_fbid") ||
        url.searchParams.has("fbid");

      if (!isVideo && !isPost) {
        return null;
      }

      const plugin = isVideo ? "video" : "post";
      const showText = isVideo ? "false" : "true";
      const isReel = /\/reel\//i.test(path);

      return {
        url: `https://www.facebook.com/plugins/${plugin}.php?href=${encodeURIComponent(url.href)}&show_text=${showText}`,
        layout: isVideo ? null : "facebook-post",
        aspectRatio: isReel ? "9 / 16" : isVideo ? "16 / 9" : null,
      };
    },
  },
  {
    name: "X", //Twitter
    getEmbedUrl(url) {
      const host = url.hostname.replace(/^www\./, "");
      const match = url.pathname.match(/^\/(?:[^/]+\/)?status\/(\d+)/);

      return (host === "x.com" || host === "twitter.com") &&
        match &&
        socialPostIdPattern.test(match[1])
        ? url.href
        : null;
    },
  },
  {
    name: "TikTok",
    getEmbedUrl(url) {
      const host = url.hostname.replace(/^(www|m)\./, "");
      const match = url.pathname.match(/^\/@[^/]+\/video\/(\d+)/);

      return host === "tiktok.com" && match
        ? {
            url: `https://www.tiktok.com/embed/v2/${match[1]}`,
            aspectRatio: "9 / 16",
          }
        : null;
    },
  },
];

// Only allow web URLs; other protocols must remain plain text.
function parseHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

// Identify direct image links or URLs supported by one of the embed providers.
function getMedia(url) {
  const parsedUrl = parseHttpUrl(url);

  if (!parsedUrl) {
    return null;
  }

  if (imageExtensionPattern.test(parsedUrl.pathname)) {
    return { type: "image", url: parsedUrl.href };
  }

  for (const provider of embedProviders) {
    const embed = provider.getEmbedUrl(parsedUrl);

    if (embed) {
      return {
        type: "embed",
        name: provider.name,
        url: typeof embed === "string" ? embed : embed.url,
        layout: typeof embed === "string" ? null : embed.layout,
        aspectRatio: typeof embed === "string" ? null : embed.aspectRatio,
      };
    }
  }

  return null;
}

// Use a [ratio=9:16] suffix for embeds whose dimensions cannot be inferred from the URL.
function getRequestedAspectRatio(block, match) {
  const suffix = block
    .slice(match.index + match[0].length)
    .match(/^\s+\[ratio=(\d{1,4}):(\d{1,4})\]\s*$/i);

  if (!suffix) {
    return null;
  }

  const width = Number(suffix[1]);
  const height = Number(suffix[2]);

  const ratio = width / height;

  return width > 0 && height > 0 && ratio >= 0.25 && ratio <= 4
    ? { aspectRatio: `${width} / ${height}`, suffix: suffix[0] }
    : null;
}

function loadXWidgets() {
  if (window.twttr?.widgets) {
    return Promise.resolve(window.twttr);
  }

  if (!xWidgetsPromise) {
    xWidgetsPromise = new Promise((resolve, reject) => {
      let script = document.querySelector(
        'script[src="https://platform.twitter.com/widgets.js"]'
      );

      if (!script) {
        script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.head.appendChild(script);
      }

      script.addEventListener(
        "load",
        () => {
          if (window.twttr?.widgets) {
            resolve(window.twttr);
          } else {
            reject(new Error("X embed widgets were unavailable after loading."));
          }
        },
        { once: true }
      );
      script.addEventListener(
        "error",
        () => reject(new Error("Failed to load X embed widgets.")),
        { once: true }
      );
    }).catch((error) => {
      xWidgetsPromise = null;
      throw error;
    });
  }

  return xWidgetsPromise;
}

function XPostEmbed({ url }) {
  const postRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    loadXWidgets()
      .then((twttr) => {
        if (isMounted && postRef.current) {
          twttr.widgets.load(postRef.current);
        }
      })
      .catch((error) => {
        console.error("Unable to render X post embed:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <blockquote className="twitter-tweet" ref={postRef}>
      <a href={url}>View post on X</a>
    </blockquote>
  );
}

// Use the image filename as a basic alt label when no caption is provided.
function getImageAlt(url) {
  const filename = new URL(url).pathname.split("/").pop() || "Shared image";

  try {
    return decodeURIComponent(filename).replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
  } catch {
    return "Shared image";
  }
}

// Render a detected image or provider embed with a link back to its source.
function renderMedia(media, url, key) {
  const parsedUrl = parseHttpUrl(url);

  if (media?.type === "image") {
    return (
      <img
        key={key}
        className="rich-content-image"
        src={media.url}
        alt={getImageAlt(media.url)}
        loading="lazy"
      />
    );
  }

  if (media?.type === "embed") {
    return (
      <div
        className={`rich-content-embed rich-content-embed-${media.name.toLowerCase()}${media.layout ? ` rich-content-embed-${media.layout}` : ""}`}
        key={key}
      >
        {media.name === "X" ? (
          <XPostEmbed url={parsedUrl.href} />
        ) : (
          <iframe
            src={media.url}
            title={`${media.name} media`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            style={media.aspectRatio ? { aspectRatio: media.aspectRatio } : undefined}
          />
        )}
        <a href={parsedUrl.href} target="_blank" rel="noopener noreferrer">
          Open on {media.name} ↗
        </a>
      </div>
    );
  }

  return null;
}

// Keep non-embedded URLs usable as safe links that open separately.
function renderUrl(url, key) {
  const parsedUrl = parseHttpUrl(url);

  if (!parsedUrl) {
    return url;
  }

  return (
    <a key={key} href={parsedUrl.href} target="_blank" rel="noopener noreferrer">
      {url}
    </a>
  );
}

// Render Markdown links as labeled anchors, validating their destination first.
function renderMarkdownLink(token, key) {
  const match = token.match(markdownLinkPattern);
  const parsedUrl = match && parseHttpUrl(match[2]);

  if (!match || !parsedUrl) {
    return token;
  }

  return (
    <a key={key} href={parsedUrl.href} target="_blank" rel="noopener noreferrer">
      {match[1]}
    </a>
  );
}

// Render inline Markdown emphasis and URLs while preserving surrounding text.
function renderInlineText(text, blockIndex) {
  const tokens = [...text.matchAll(inlineTokenPattern)];
  const parts = [];
  let cursor = 0;

  tokens.forEach((match, tokenIndex) => {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    const token = match[0];

    if (token.startsWith("[") && token.includes("](")) {
      parts.push(renderMarkdownLink(token, `markdown-link-${blockIndex}-${tokenIndex}`));
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`bold-${blockIndex}-${tokenIndex}`}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={`italic-${blockIndex}-${tokenIndex}`}>
          {token.slice(1, -1)}
        </em>
      );
    } else {
      const url = token.replace(trailingPunctuationPattern, "");
      const punctuation = token.slice(url.length);
      parts.push(
        renderUrl(url, `link-${blockIndex}-${tokenIndex}`),
        punctuation
      );
    }

    cursor = match.index + token.length;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts.length ? parts : text;
}

// Don't treat the destination of a labeled Markdown link as a standalone embed.
function isMarkdownLinkTarget(block, match) {
  const beforeUrl = block.slice(0, match.index);
  const afterUrl = block.slice(match.index + match[0].length);

  return beforeUrl.endsWith("](") && afterUrl.startsWith(")");
}

// A paragraph with one supported media URL is displayed as media plus its text.
function renderParagraph(block, blockIndex) {
  const urls = [...block.matchAll(urlPattern)];

  if (urls.length === 1 && !isMarkdownLinkTarget(block, urls[0])) {
    const match = urls[0];
    const url = match[0].replace(trailingPunctuationPattern, "");
    const media = getMedia(url);

    if (media) {
      const requestedRatio =
        media.type === "embed" ? getRequestedAspectRatio(block, match) : null;
      const remainder = block.slice(match.index + match[0].length);
      const textAfterUrl = requestedRatio
        ? remainder.replace(requestedRatio.suffix, "")
        : remainder;

      if (requestedRatio) {
        media.aspectRatio = requestedRatio.aspectRatio;
      }

      const details = (
        block.slice(0, match.index) +
        textAfterUrl
      ).trim();

      return (
        <div
          className={`rich-content-media-row${details ? " has-details" : ""}${media.name === "X" ? " has-x-embed" : ""}`}
          key={blockIndex}
        >
          <div className="rich-content-media">
            {renderMedia(media, url, `media-${blockIndex}`)}
          </div>
          {details && (
            <div className="rich-content-media-details">
              {renderInlineText(details, blockIndex)}
            </div>
          )}
        </div>
      );
    }
  }

  return <p key={blockIndex}>{renderInlineText(block, blockIndex)}</p>;
}

// Split content into paragraphs, preserving regular text and recognizing media blocks.
export default function RichContent({ text, className = "" }) {
  if (typeof text !== "string" || !text.trim()) {
    return null;
  }

  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={`rich-content ${className}`.trim()}>
      {blocks.map(renderParagraph)}
    </div>
  );
}
