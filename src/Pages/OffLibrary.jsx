import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import Officers from "../Components/Officers";
import { Link } from "react-router-dom";
import "./Library.css";

const OffLibrary = () => {
  const [officer, setOfficer] = useState([]);

  useEffect(() => {
    const fetchVids = async () => {
      const { data, error } = await supabase
        .from("officers")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching officers:", error);
      } else {
        setOfficer(data);
      }
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
          {officer.length === 0 ? (
            <p>Loading...</p>
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