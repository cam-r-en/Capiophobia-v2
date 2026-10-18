import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import Victims from "../Components/Victims";
import { Link } from "react-router-dom";
import "./Library.css";

const VicLibrary = () => {
  const [vics, setVics] = useState([]);

  useEffect(() => {
    const fetchVids = async () => {
      const { data, error } = await supabase
        .from("victims")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching videos:", error);
      } else {
        setVics((data || []).filter((person) => person.vicname?.trim()));
      }
    };

    fetchVids();
  }, []);

  return (
    <>
      <div className="intro">
        <img id="shead-img" src="/imgs/Intro Badge.gif" alt="Intro Badge" />
        <h1>Victims</h1>
        <Link to="/" className="hnav-button">
          &larr; Main Page
        </Link>
      </div>
      <div className="page">
        <div className="ReadCon">
          {vics.length === 0 ? (
            <p>No victim stories have been added yet.</p>
          ) : (
            vics.map((vic) => (
              <Link to={`/victims/${vic.id}`} key={vic.id}>
                <Victims
                  id={vic.id}
                  vicimg={vic.vicimg}
                  vicname={vic.vicname}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default VicLibrary;