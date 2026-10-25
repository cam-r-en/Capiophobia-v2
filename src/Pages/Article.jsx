import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../client";
import LoadingIndicator from "../Components/LoadingIndicator";
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

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        setHasError(true);
      } else {
        setArticle(data);
      }
      setIsLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (isLoading) return <LoadingIndicator label="Loading article" />;
  if (!article) {
    return (
      <p role="alert">
        {hasError ? "This article could not be loaded." : "This article does not exist."}
      </p>
    );
  }

  return (
    <>
      <div className="detail-page">
        <div className="c-intro">
          <Link to="/">
            <img
              id="chead-img"
              src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`}
              alt="Intro Badge"
            />
          </Link>
          <nav className="detail-nav-actions" aria-label="Page navigation">
            <Link className="c-hnav-button" to="/">Home</Link>
            <Link className="c-hnav-button" to="/morearticles">
              Read More
            </Link>
          </nav>
        </div>
        <div className="c-head">
          <img className="c-tbnl" src={article.tbnl} alt={article.title} />
          <hr className="t-divide" />
          <div className="c-shead">
            <span className="c-title">{article.title}</span>
            <p className="c-author">By {article.author}</p>
            <div className="c-creation">{formatDate(article.created_at)}</div>
          </div>
        </div>
        <hr className="d-divide" />
        <div className="c-content">
          <RichContent text={article.essay} className="c-description" />
        </div>
      </div>
      
    </>
  );
};

export default Article;
