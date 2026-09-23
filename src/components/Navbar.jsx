import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useNotification } from './Notification.jsx'

const readUser = () => {
  try {
    const raw = localStorage.getItem('stayhealthy_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(readUser)
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    const sync = () => setUser(readUser())
    window.addEventListener('stayhealthy-auth', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('stayhealthy-auth', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('stayhealthy_token')
    localStorage.removeItem('stayhealthy_authtoken')
    localStorage.removeItem('stayhealthy_user')
    window.dispatchEvent(new Event('stayhealthy-auth'))
    setUser(null)
    setOpen(false)
    showNotification('You have been logged out.', 'success')
    navigate('/')
  }

  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">+</span>
          StayHealthy
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>

        <nav className={open ? 'nav-panel open' : 'nav-panel'} aria-label="Main">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)} onClick={close}>
            Home
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => (isActive ? 'active' : undefined)} onClick={close}>
            Appointments
          </NavLink>
          <NavLink to="/reviews" className={({ isActive }) => (isActive ? 'active' : undefined)} onClick={close}>
            Reviews
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : undefined)} onClick={close}>
            Profile
          </NavLink>

          {user ? (
            <div className="nav-actions">
              <span className="nav-user">Hi, {user.name}</span>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-actions">
              <NavLink to="/login" className="btn btn-ghost" onClick={close}>
                Login
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary" onClick={close}>
                Sign Up
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
