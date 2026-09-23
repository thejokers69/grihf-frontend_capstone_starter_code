import React, { useState } from 'react'
import API_BASE from '../api.js'
import { useNotification } from './Notification.jsx'

const ProfileCard = ({ user, onUpdated }) => {
  const { showNotification } = useNotification()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [busy, setBusy] = useState(false)

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('stayhealthy_token') || ''}`
        },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (!response.ok || data.status !== 'success') {
        showNotification(data.message || 'Could not update the profile.', 'error')
        return
      }
      localStorage.setItem('stayhealthy_user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('stayhealthy-auth'))
      onUpdated(data.user)
      setEditing(false)
      showNotification('Profile saved.', 'success')
    } catch {
      showNotification('The profile service is unavailable.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="profile-card">
      <div className="avatar large" aria-hidden="true">
        {(user?.name || 'G').charAt(0)}
      </div>
      {!editing ? (
        <div className="profile-view">
          <h2>{user?.name || 'Guest'}</h2>
          <p className="role-pill">{user?.role || 'patient'}</p>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{user?.email || '—'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{user?.phone || '—'}</dd>
            </div>
          </dl>
          <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        </div>
      ) : (
        <form className="profile-edit-form" onSubmit={saveProfile}>
          <h2>Edit profile</h2>
          <div className="form-group">
            <label htmlFor="profile-name">Name</label>
            <input id="profile-name" name="name" type="text" value={form.name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="profile-email">Email</label>
            <input id="profile-email" name="email" type="email" value={form.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="profile-phone">Phone</label>
            <input id="profile-phone" name="phone" type="tel" value={form.phone} onChange={onChange} required />
          </div>
          <div className="row-actions">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </article>
  )
}

export default ProfileCard
