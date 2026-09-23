import React, { useState } from 'react'
import API_BASE from '../api.js'
import { useNotification } from './Notification.jsx'

const AppointmentForm = ({ doctorName, onBooked }) => {
  const { showNotification } = useNotification()
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' })
  const [busy, setBusy] = useState(false)

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const book = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, doctorName, type: 'scheduled' })
      })
      const data = await response.json()
      if (!response.ok || data.status !== 'success') {
        showNotification(data.message || 'Could not book the appointment.', 'error')
        return
      }
      showNotification('Appointment booked.', 'success')
      onBooked(data.appointment)
      setForm({ name: '', phone: '', date: '', time: '' })
    } catch {
      showNotification('The booking service is unavailable.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="stack-form" onSubmit={book}>
      <h3>Schedule a visit{doctorName ? ` with Dr. ${doctorName}` : ''}</h3>
      <div className="form-group">
        <label htmlFor="apt-name">Name</label>
        <input id="apt-name" name="name" type="text" value={form.name} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="apt-phone">Phone Number</label>
        <input id="apt-phone" name="phone" type="tel" value={form.phone} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="apt-date">Date</label>
        <input id="apt-date" name="date" type="date" value={form.date} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="apt-time">Time</label>
        <input id="apt-time" name="time" type="time" value={form.time} onChange={onChange} required />
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Booking…' : 'Book appointment'}
      </button>
    </form>
  )
}

export default AppointmentForm
