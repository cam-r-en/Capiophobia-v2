import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import LoadingIndicator from "../Components/LoadingIndicator";
import Officers from "../Components/Officers";
import { Link } from "react-router-dom";
import "./Library.css";

const OffLibrary = () => {
  const [officer, setOfficer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVids = async () => {
      const { data, error } = await supabase
        .from("officers")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching officers:", error);
        setErrorMessage("Officers could not be loaded. Please try again later.");
      } else {
        setOfficer(data || []);
      }
      setIsLoading(false);
    };

    fetchVids();
  }, []);

  return (
    <>
      <div className="intro">
        <img
          id="shead-img"
          src={`${import.meta.env.BASE_URL}imgs/Intro Badge.gif`}
          alt="Intro Badge"
        />
        <h1>Officers</h1>
        <Link to="/" className="hnav-button">
          &larr; Main Page
        </Link>
      </div>
      <div className="page">
        <div className="ReadCon">
          {isLoading ? (
            <LoadingIndicator label="Loading officers" />
          ) : errorMessage ? (
            <p role="alert">{errorMessage}</p>
          ) : officer.length === 0 ? (
            <p>No officers have been added yet.</p>
          ) : (
            officer.map((off) => (
              <Link to={`/officers/${off.id}`} key={off.id}>
                <Officers
                  id={off.id}
                  offimg={off.offimg}
                  offname={off.offname}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OffLibrary;