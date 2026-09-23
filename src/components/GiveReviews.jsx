import React, { useState } from 'react'
import API_BASE from '../api.js'
import { useNotification } from './Notification.jsx'

const GiveReviews = () => {
  const { showNotification } = useNotification()
  const [form, setForm] = useState({ name: '', email: '', rating: '5', review: '' })
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submitReview = async (event) => {
    event.preventDefault()
    if (submitted) return
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (!response.ok || data.status !== 'success') {
        showNotification(data.message || 'Could not save your review.', 'error')
        return
      }
      setSubmitted(true)
      showNotification('Thank you. Your review was submitted.', 'success')
    } catch {
      showNotification('The review service is unavailable.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="stack-form review-form" onSubmit={submitReview}>
      <h2>Give a review</h2>
      <p className="sub">Tell us how the visit went. The form locks after you submit.</p>
      <fieldset disabled={submitted} className="plain-fieldset">
        <div className="form-group">
          <label htmlFor="review-name">Name</label>
          <input id="review-name" name="name" type="text" value={form.name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="review-email">Email</label>
          <input id="review-email" name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="review-rating">Rating</label>
          <select id="review-rating" name="rating" value={form.rating} onChange={onChange} required>
            <option value="5">5 — Excellent</option>
            <option value="4">4 — Good</option>
            <option value="3">3 — Okay</option>
            <option value="2">2 — Poor</option>
            <option value="1">1 — Very poor</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="review-text">Review</label>
          <textarea id="review-text" name="review" rows={5} value={form.review} onChange={onChange} required />
        </div>
      </fieldset>
      <button className="btn btn-primary" type="submit" disabled={busy || submitted}>
        {submitted ? 'Review submitted' : busy ? 'Sending…' : 'Submit review'}
      </button>
      {submitted && <p className="success-note">This form is disabled because your review was sent.</p>}
    </form>
  )
}

export default GiveReviews
