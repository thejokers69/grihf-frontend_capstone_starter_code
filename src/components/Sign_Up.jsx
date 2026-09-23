import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_BASE from '../api.js'
import { useNotification } from './Notification.jsx'

const Sign_Up = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [form, setForm] = useState({
    role: 'patient',
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [busy, setBusy] = useState(false)

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const registerUser = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (!response.ok || data.status !== 'success') {
        showNotification(data.message || 'Registration failed.', 'error')
        return
      }
      showNotification('Account created. Please log in.', 'success')
      navigate('/login')
    } catch {
      showNotification('The registration service is unavailable.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <section className="auth-card" aria-labelledby="signup-title">
        <p className="kicker">New patient or doctor</p>
        <h1 id="signup-title">Create your account</h1>
        <p className="sub">Join StayHealthy to book care from anywhere.</p>
        <form onSubmit={registerUser}>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={onChange} required>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={onChange} placeholder="Amina El Fassi" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="+212 6 12 34 56 78" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={onChange} minLength={8} placeholder="At least 8 characters" required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="switch-auth">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  )
}

export default Sign_Up
