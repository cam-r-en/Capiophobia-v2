import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../client";
import "./All.css"; 

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
      } else {
        setArticle(data);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <>
      <div className="detail-page">
        <div className="article-detail-card">
          <div className="intro">
            <h1>{article.title}</h1>
            <p>
              <strong>Author:</strong> {article.author}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(article.created_at).toLocaleDateString()}
            </p>

            {article.tbnl && (
              <img
                src={article.tbnl}
                alt={article.title}
                className="article-image"
              />
            )}
          </div>
          <div className="essay-content">
            <p>{article.essay}</p>
          </div>
        </div>
        <div className="outro">
          <Link to="/Home" className="nav-button">
            Main Page
          </Link>
          <Link to="/morestories" className="nav-button">
            All Articles
          </Link>
        </div>
      </div>
    </>
  );
};

export default Article;
