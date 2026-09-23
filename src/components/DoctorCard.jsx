import React, { useState } from 'react'
import API_BASE from '../api.js'
import { useNotification } from './Notification.jsx'

const DoctorCard = ({ appointment, onCancelled }) => {
  const { showNotification } = useNotification()
  const [busy, setBusy] = useState(false)
  const doctorName = appointment.doctorName || 'On-call clinician'

  const cancelAppointment = async () => {
    const confirmed = window.confirm(`Cancel the appointment with Dr. ${doctorName}?`)
    if (!confirmed) return
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/appointments/${appointment.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (!response.ok || data.status !== 'success') {
        showNotification(data.message || 'Could not cancel the appointment.', 'error')
        return
      }
      showNotification('Appointment cancelled.', 'success')
      onCancelled(appointment.id)
    } catch {
      showNotification('The booking service is unavailable.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="doctor-card">
      <div className="avatar" aria-hidden="true">{doctorName.charAt(0)}</div>
      <div>
        <h3>Dr. {doctorName}</h3>
        <p>{appointment.specialty || 'General practice'}</p>
        <p className="muted">
          {appointment.type === 'instant'
            ? `Call-back for ${appointment.name}`
            : `${appointment.date || 'Date pending'} at ${appointment.time || 'time pending'}`}
        </p>
      </div>
      <button type="button" className="btn btn-danger" onClick={cancelAppointment} disabled={busy}>
        {busy ? 'Cancelling…' : 'Cancel appointment'}
      </button>
    </article>
  )
}

export default DoctorCard
