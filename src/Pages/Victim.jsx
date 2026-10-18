import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client";
import RichContent from "../Components/RichContent";
import "./Detail.css";

const Victim = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [relatedOfficers, setRelatedOfficers] = useState([]);

  useEffect(() => {
    let isCurrent = true;

    const fetchData = async () => {
      const [victimResult, officersResult] = await Promise.all([
        supabase.from("victims").select().eq("id", id).single(),
        supabase
          .from("officer_victims")
          .select("officer:officers(id, offname, offimg)")
          .eq("victim_id", id),
      ]);

      if (!isCurrent) return;

      if (victimResult.error) {
        console.error("Error fetching victim:", victimResult.error);
      } else {
        setPerson(victimResult.data);
      }

      if (officersResult.error) {
        console.error("Error fetching related officers:", officersResult.error);
      } else {
        setRelatedOfficers(
          officersResult.data.map((row) => row.officer).filter(Boolean)
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
          <Link className="c-hnav-button" to="/morevictims">
            Other Victims
          </Link>
        </nav>
      </header>
      <section className="c-head">
        <img className="c-tbnl" src={person.vicimg} alt={person.vicname} />
        <div className="c-shead">
          <h1 className="c-title">{person.vicname}</h1>
        </div>
      </section>
      <hr className="d-divide" />
      <section className="c-content">
        <RichContent text={person.vicbio} className="c-description" />
      </section>
      <hr className="d-divide" />
      <section className="related-people" aria-labelledby="related-officers-title">
        <h2 id="related-officers-title">Officers Involved</h2>
        {relatedOfficers.length ? (
          <div className="related-people-grid">
            {relatedOfficers.map((officer) => (
              <Link
                className="related-person"
                to={`/officers/${officer.id}`}
                key={officer.id}
              >
                {officer.offimg && (
                  <img src={officer.offimg} alt="" loading="lazy" />
                )}
                <span>{officer.offname}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p>No officers are linked to this victim.</p>
        )}
      </section>
    </main>
  );
};

export default Victim;