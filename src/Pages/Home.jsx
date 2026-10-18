import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { supabase } from "../client";
import SearchForm from "../Components/SearchForm";

function Home() {
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [victims, setVictims] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [stories, setStories] = useState([]);
  const [featuredStory, setFeaturedStory] = useState(null); //Most recent article/video/story published

  useEffect(() => {
    //Fetch content from Supabase
    const fetchContent = async () => {
      // videos
      const { data: videosData } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      // articles
      const { data: articlesData } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      // victims
      const { data: victimsData } = await supabase
        .from("victims")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      // officers
      const { data: officersData } = await supabase
        .from("officers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      // stories
      const { data: storiesData } = await supabase
        .from("stories")
        .select("*")
        .eq("is_posted", true)
        .order("created_at", { ascending: false })
        .limit(25);

      setVideos(videosData || []);
      setArticles(articlesData || []);
      setVictims(victimsData || []);
      setOfficers(officersData || []);
      setStories(storiesData || []);

      // Keep the featured card focused on the latest video or article.
      const newestVideo = videosData?.[0];
      const newestArticle = articlesData?.[0];
      const latestItems = [
        newestVideo && { ...newestVideo, type: "video" },
        newestArticle && { ...newestArticle, type: "article" },
      ].filter(Boolean);

      setFeaturedStory(
        latestItems.sort(
          (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
        )[0] || null,
      );
    };

    fetchContent();
  }, []);

  return (
    <>
      <div className="home-page">
        {/* Header */}
        <div className="header-container">
          <div className="warning-container">
            <img
              id="head-img"
              src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`}
              alt="Intro Badge"
            />
            <i>
              <p className="disclaim">
                This website may contain some sensitive topics. <br />
                We report on all forms of police brutality that happen to any
                person. <br />
                This website is not at all meant to demonify all police
                officers.
              </p>
            </i>
          </div>
          <div className="title-container">
            <h1 id="title">Capiophobia</h1>
            <h3 id="about">
              The Fear of Getting Arrested, Even For No Apparent Reason.
            </h3>
          </div>
        </div>
        <div className="search-container">
          <SearchForm />
        </div>
        {/* Featured Content */}
        <div className="feature-container">
          <h3 className="fts">Latest {featuredStory?.type}</h3>
          {featuredStory ? (
            <Link
              className="featured-story"
              to={`/${featuredStory.type}/${featuredStory.id}`}
            >
              {featuredStory.tbnl && (
                <img
                  className="featured-story-image"
                  src={featuredStory.tbnl}
                  alt=""
                />
              )}
              <span className="featured-story-copy">
                <span className="featured-story-title">
                  {featuredStory.title}
                </span>
                <span className="featured-story-meta">
                  {featuredStory.type === "article" ? "Article" : "Video"} ·{" "}
                  {new Date(featuredStory.created_at).toLocaleDateString()}
                </span>
                <span className="featured-story-cta">Read more →</span>
              </span>
            </Link>
          ) : (
            <p className="featured-story-empty">
              No articles or videos have been posted yet.
            </p>
          )}
        </div>

        {/* Navbar */}
        <nav className="navbar" id="navbar">
          <ul>
            <li>
              <a href="#video-container">Videos</a>
            </li>
            <li>
              <a href="#post-container">Articles</a>
            </li>
            <li>
              <a href="#people-container">Victims/Officers</a>
            </li>
            <li>
              <a href="#story-container">Stories</a>
            </li>
          </ul>
        </nav>

        {/* Content Sections */}
        <section id="video-container">
          <h2 className="section-title">Videos</h2>
          <div className="video-container">
            {videos.map((video) => (
              <Link to={`/video/${video.id}`} key={video.id}>
                <div className="c-item">
                  <img src={video.tbnl} alt={video.title} />
                  <h4> {video.title} </h4>
                </div>
              </Link>
            ))}
            <Link to="/morevideos" className="nav-button">
              More Videos
            </Link>
          </div>
        </section>

        <section id="article-container">
          <h2 className="section-title">Articles</h2>
          <div className="article-container">
            {articles.map((article) => (
              <Link to={`/article/${article.id}`} key={article.id}>
                <div className="c-item">
                  <img src={article.tbnl} alt={article.title} />
                  <h4>{article.title}</h4>
                </div>
              </Link>
            ))}
            <Link to="/morearticles" className="nav-button">
              More Articles
            </Link>
          </div>
        </section>

        <section id="people-container">
          <h2 className="section-title">Victims</h2>
          <div className="victim-container">
            {victims.map((victim) => (
              <Link to={`/victims/${victim.id}`} key={victim.id}>
                <div className="c-item">
                  <img src={victim.vicimg} alt={victim.vicname} />
                  <h4>{victim.vicname}</h4>
                </div>
              </Link>
            ))}
            <Link to="/morevictims" className="nav-button">
              More Victims
            </Link>
          </div>

          <h2 className="section-title">Officers</h2>
          <div className="officer-container">
            {officers.map((officer) => (
              <Link to={`/officers/${officer.id}`} key={officer.id}>
                <div className="c-item">
                  <img src={officer.offimg} alt={officer.offname} />
                  <h4>{officer.offname}</h4>
                </div>
              </Link>
            ))}
            <Link to="/moreofficers" className="nav-button">
              More Officers
            </Link>
          </div>
        </section>

        <section id="stories">
          <div className="stories">
            <h6>Community Stories</h6>
            <p>
              Have a story to share?{" "}
              <Link to="/submit-story">Submit it for review.</Link>
            </p>
            <section id="story-container">
              <div className="story-container">
                {stories[0] && (
                  <Link
                    className="featured-story community-story-feature"
                    to={`/story/${stories[0].id}`}
                  >
                    <span className="featured-story-copy">
                      <span className="featured-story-title">
                        Shared by {stories[0].user || "Anonymous"}
                      </span>
                      <span className="featured-cstory-meta">
                        Most recent community story ·{" "}
                        {new Date(stories[0].created_at).toLocaleDateString()}
                      </span>
                      <span className="community-story-excerpt">
                        {stories[0].written}
                      </span>
                      <span className="featured-story-cta">Read story →</span>
                    </span>
                  </Link>
                )}
                {stories.slice(1).map((story) => (
                  <Link to={`/story/${story.id}`} key={story.id}>
                    <div className="cs-item">
                      <p>{story.written}</p>
                      <h4>{story.user || "Anonymous"}</h4>
                    </div>
                  </Link>
                ))}
                <Link to="/morestories" className="cs-nav-button">
                  More Stories
                </Link>
              </div>
            </section>
          </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
