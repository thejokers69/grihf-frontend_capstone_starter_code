import React, { useState } from 'react'
import API_BASE from '../api.js'
import { useNotification } from './Notification.jsx'

const AppointmentFormIC = ({ onBooked }) => {
  const { showNotification } = useNotification()
  const [form, setForm] = useState({ name: '', phone: '' })
  const [busy, setBusy] = useState(false)

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const requestCall = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, type: 'instant' })
      })
      const data = await response.json()
      if (!response.ok || data.status !== 'success') {
        showNotification(data.message || 'Could not request a call.', 'error')
        return
      }
      showNotification('Instant consultation requested. A doctor will call you.', 'success')
      onBooked(data.appointment)
      setForm({ name: '', phone: '' })
    } catch {
      showNotification('The booking service is unavailable.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="stack-form" onSubmit={requestCall}>
      <h3>Instant consultation</h3>
      <p className="sub">Leave your name and phone number. We will call you back.</p>
      <div className="form-group">
        <label htmlFor="ic-name">Name</label>
        <input id="ic-name" name="name" type="text" value={form.name} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="ic-phone">Phone Number</label>
        <input id="ic-phone" name="phone" type="tel" value={form.phone} onChange={onChange} required />
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Sending…' : 'Request a call'}
      </button>
    </form>
  )
}

export default AppointmentFormIC
