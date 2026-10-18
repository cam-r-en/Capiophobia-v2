import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client";
import RichContent from "../Components/RichContent";
import "./Detail.css";

const Officer = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [relatedVictims, setRelatedVictims] = useState([]);

  useEffect(() => {
    let isCurrent = true;

    const fetchData = async () => {
      const [officerResult, victimsResult] = await Promise.all([
        supabase.from("officers").select().eq("id", id).single(),
        supabase
          .from("officer_victims")
          .select("victim:victims(id, vicname, vicimg)")
          .eq("officer_id", id),
      ]);

      if (!isCurrent) return;

      if (officerResult.error) {
        console.error("Error fetching officer:", officerResult.error);
      } else {
        setPerson(officerResult.data);
      }

      if (victimsResult.error) {
        console.error("Error fetching related victims:", victimsResult.error);
      } else {
        setRelatedVictims(
          victimsResult.data.map((row) => row.victim).filter(Boolean)
        );
      }
    };

    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  if (!person) return <p>Loading...</p>;

  return (
    <main className="detail-page">
      <header className="c-intro">
        <Link to="/">
          <img id="chead-img" src="/imgs/Intro Badge.gif" alt="Intro Badge" />
        </Link>
        <nav className="detail-nav-actions" aria-label="Page navigation">
          <Link className="c-hnav-button" to="/">Home</Link>
          <Link className="c-hnav-button" to="/moreofficers">
            Other Officers
          </Link>
        </nav>
      </header>
      <section className="c-head">
        <img className="c-tbnl" src={person.offimg} alt={person.offname} />
        <div className="c-shead">
          <h1 className="c-title">{person.offname}</h1>
        </div>
      </section>
      <hr className="d-divide" />
      <section className="c-content">
        <RichContent text={person.offbio} className="c-description" />
      </section>
      <hr className="d-divide" />
      <section className="related-people" aria-labelledby="related-victims-title">
        <h2 id="related-victims-title">Victims Involved</h2>
        {relatedVictims.length ? (
          <div className="related-people-grid">
            {relatedVictims.map((victim) => (
              <Link
                className="related-person"
                to={`/victims/${victim.id}`}
                key={victim.id}
              >
                {victim.vicimg && (
                  <img src={victim.vicimg} alt="" loading="lazy" />
                )}
                <span>{victim.vicname}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p>No victims are linked to this officer.</p>
        )}
      </section>
    </main>
  );
};

export default Officer;