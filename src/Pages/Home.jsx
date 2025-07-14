import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { supabase } from "../client";

function Home() {
  /*
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [victims, setVictims] = useState([]);
  const [officers, setOfficers] = useState([]);
  */

  useEffect(() => {
    const fetchArticles = async () => {
      // Fetch posts
      const { data: articleData } = await supabase.from("stories").select();

      // Sort posts based on selected sorting option
      articleData.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      ); // Sort by creation date (ascending)
    };
    fetchArticles();

    //Navbar Function
    const navbar = document.getElementById("navbar");
    const navbarOffset = navbar.offsetTop;

    const handleScroll = () => {
      if (window.scrollY >= navbarOffset) {
        navbar.classList.add("fixed-nav");
      } else {
        navbar.classList.remove("fixed-nav");
      }
    };

    window.addEventListener("scroll", handleScroll);
    //Navbar Function

    //"Policing The Police"
    const thumbnails = document.querySelectorAll(".video-thumbnail");
    function handleClick(event) {
      const videoId = event.currentTarget.getAttribute("data-video");
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(youtubeUrl, "_blank");
    }
    thumbnails.forEach((thumbnail) => {
      thumbnail.style.cursor = "pointer";
      thumbnail.addEventListener("click", handleClick);
    });
    return () => {
      thumbnails.forEach((thumbnail) => {
        thumbnail.removeEventListener("click", handleClick);
      });
    };
    //"Policing The Police"
  }, []);

  return (
    <>
      <div className="home-page">
        {/* Header */}
        <h1 id="title">Capiophobia</h1>

        <div className="header-container">
          <div className="title-container">
            <img id="head-img" src="imgs/Intro Badge.gif" alt="Intro Badge" />
            <h3 id="about">
              The Fear of Getting Arrested, Even For No Apparent Reason.
            </h3>
          </div>
          <div className="feature-container">
            <h3 className="fts"> Featured Story: </h3>
          </div>
          <div className="mean-container">
            <h3 id="ptp">"Policing the Police"</h3>
            <div className="video-thumbnail" data-video="2_8vTl6D940">
              <img
                src="https://img.youtube.com/vi/2_8vTl6D940/maxresdefault.jpg"
                alt="YouTube Video Thumbnail"
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
          </div>
        </div>

        {/* Navbar */}
        <nav className="navbar" id="navbar">
          <ul>
            <li>
              <a href="#video-container">Videos</a>
            </li>
            <li>
              <a href="#stories-container">Stories</a>
            </li>
            <li>
              <a href="#post-container">Articles</a>
            </li>
            <li>
              <a href="#people-container">Victims/Officers</a>
            </li>
          </ul>
        </nav>

        {/* Content Sections */}

        <section id="video-container">
          <h2>Videos</h2>
          <div className="video-container">
            <Link to="/morevideos" className="nav-button">
              More Videos
            </Link>
          </div>
        </section>

        <section id="post-container">
          <h2>Articles</h2>
          <div className="post-container">
            <Link to="/morearticles" className="nav-button">
              More Articles
            </Link>
          </div>
        </section>

        <section id="people-container">
          <h2>Victims</h2>
          <div></div>

          <h2>Officers</h2>
          <div></div>
        </section>

        <section id="your-stories">
          <h2>Your Stories</h2>
          <div className="stories-container"></div>
        </section>

        <button className="button-57" role="button">
          <span className="text">Share Your Story</span>
          <span> Contact Us Now</span>
        </button>
      </div>
    </>
  );
}

export default Home;
