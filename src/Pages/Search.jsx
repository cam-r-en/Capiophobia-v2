import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../client";
import SearchForm from "../Components/SearchForm";
import "./Search.css";

function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);

      // Fetch all relevant tables
      const articles = (await supabase.from("stories").select())?.data || [];
      const videos = (await supabase.from("videos").select())?.data || [];
      const victims = (await supabase.from("victims").select())?.data || [];
      const officers = (await supabase.from("officers").select())?.data || [];

      // Combine into one array
      const allContent = [
        ...articles.map((a) => ({ ...a, type: "story" })),
        ...videos.map((v) => ({ ...v, type: "video" })),
        ...victims.map((v) => ({
          ...v,
          type: "person",
          subType: "victim",
        })),
        ...officers.map((v) => ({
          ...v,
          type: "person",
          subType: "officer",
        })),
      ];

      // Filter based on query
      const filtered = allContent.filter(
        (item) =>
          (item.title &&
            item.title.toLowerCase().includes(query.toLowerCase())) ||
          (item.author &&
            item.author.toLowerCase().includes(query.toLowerCase())) ||
          (item.creator &&
            item.creator.toLowerCase().includes(query.toLowerCase())) ||
          (item.offname &&
            item.offname.toLowerCase().includes(query.toLowerCase())) ||
          (item.vicname &&
            item.vicname.toLowerCase().includes(query.toLowerCase())),
      );

      setResults(filtered);
      setLoading(false);
    };

    if (query.trim()) {
      fetchAndFilter();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  // Group results by category
  const stories = results.filter((r) => r.type === "story");
  const videosRes = results.filter((r) => r.type === "video");
  const offs = results.filter(
    (r) => r.type === "person" && r.subType === "officer",
  );
  const vics = results.filter(
    (r) => r.type === "person" && r.subType === "victim",
  );

  return (
    <div className="search-page">
      <div className="intro">
        <Link to="/">
          <img
            id="chead-img"
            src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`}
            alt="Intro Badge"
          />
        </Link>{" "}
        <h1>Search</h1>
        <SearchForm />
      </div>

      <h1>Search Results for "{query}"</h1>

      {loading && <p>Loading...</p>}

      {!loading && results.length === 0 && <p>No results found.</p>}

      {!loading && results.length > 0 && (
        <div className="results-container">
          {stories.length > 0 && (
            <div className="results-section">
              <h2>Articles</h2>
              {stories.map((item) => (
                <div key={item.id} className="result-item">
                  <Link to={`/article/${item.id}`}>
                    <h3>{item.title}</h3>
                  </Link>
                  <p>{item.author || "Unknown"}</p>
                </div>
              ))}
            </div>
          )}

          {videosRes.length > 0 && (
            <div className="results-section">
              <h2>Videos</h2>
              {videosRes.map((item) => (
                <div key={item.id} className="result-item">
                  <Link to={`/video/${item.id}`}>
                    <h3>{item.title}</h3>
                  </Link>
                  <p>{item.creator || "Unknown"}</p>
                </div>
              ))}
            </div>
          )}

          {offs.length > 0 && (
            <div className="results-section">
              <h2>Officers</h2>
              {offs.map((item) => (
                <div key={item.id} className="result-item">
                  <Link to={`/officers/${item.id}`}>
                    <h3>{item.offname}</h3>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {vics.length > 0 && (
            <div className="results-section">
              <h2>Victims</h2>
              {vics.map((item) => (
                <div key={item.id} className="result-item">
                  <Link to={`/victims/${item.id}`}>
                    <h3>{item.vicname}</h3>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
