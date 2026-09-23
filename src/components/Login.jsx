import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_BASE from '../api.js'
import { useNotification } from './Notification.jsx'

const Login = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const authenticate = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (!response.ok || data.status !== 'success') {
        showNotification(data.message || 'Login failed.', 'error')
        return
      }
      const token = data.authtoken || data.token
      localStorage.setItem('stayhealthy_token', token)
      localStorage.setItem('stayhealthy_authtoken', token)
      localStorage.setItem('stayhealthy_user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('stayhealthy-auth'))
      showNotification(`Welcome back, ${data.user.name}.`, 'success')
      navigate('/appointments')
    } catch {
      showNotification('The login service is unavailable.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="kicker">Welcome back</p>
        <h1 id="login-title">Login to StayHealthy</h1>
        <p className="sub">Use the email and password from your registration.</p>
        <form onSubmit={authenticate}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Your password" required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Checking…' : 'Login'}
          </button>
        </form>
        <p className="switch-auth">
          New here? <Link to="/signup">Sign Up</Link>
        </p>
      </section>
    </div>
  )
}

export default Login
