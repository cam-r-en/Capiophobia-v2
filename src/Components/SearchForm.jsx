import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchForm.css";

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
      <button type="submit">/</button>
    </form>
  );
}

export default SearchForm;
