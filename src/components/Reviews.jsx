import React from 'react'
import GiveReviews from './GiveReviews.jsx'

const Reviews = () => {
  return (
    <div className="page narrow">
      <header className="page-head">
        <p className="kicker">Patient feedback</p>
        <h1>Reviews</h1>
        <p className="lede">Share a short note about your StayHealthy visit.</p>
      </header>
      <GiveReviews />
    </div>
  )
}

export default Reviews
