import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchForm.css";

// Small search bar used in the home page and search header.
// It serializes the current input into a /search?query= route.
function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // stops page refresh
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="submit" aria-label="Search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
      </button>
    </form>
  );
}

export default SearchForm;
