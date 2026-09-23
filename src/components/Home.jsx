import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="kicker">Go Digital initiative</p>
          <h1>StayHealthy</h1>
          <p className="lede">
            Care from anywhere. StayHealthy helps patients in remote and underserved
            areas connect with doctors anytime, through a simple web visit.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/appointments">Book an appointment</Link>
            <Link className="btn btn-ghost" to="/signup">Create a free account</Link>
          </div>
        </div>
        <aside className="hero-panel">
          <h2>What you can do today</h2>
          <ul>
            <li>Search a doctor by name or specialty</li>
            <li>Request an instant call-back or pick a date and time</li>
            <li>Keep your profile and visit notes in one place</li>
          </ul>
        </aside>
      </section>

      <section className="feature-grid" aria-label="How StayHealthy works">
        <article>
          <h3>1. Join</h3>
          <p>Sign up as a patient or a doctor with your name, email, and phone.</p>
        </article>
        <article>
          <h3>2. Book</h3>
          <p>Find a clinician and reserve an instant consult or a scheduled visit.</p>
        </article>
        <article>
          <h3>3. Follow up</h3>
          <p>Review your visit, update your profile, and cancel if plans change.</p>
        </article>
      </section>
    </div>
  )
}

export default Home
