import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileCard from './ProfileCard.jsx'

const readUser = () => {
  try {
    const raw = localStorage.getItem('stayhealthy_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const Profile = () => {
  const [user, setUser] = useState(readUser)

  return (
    <div className="page narrow">
      <header className="page-head">
        <p className="kicker">Your record</p>
        <h1>Profile</h1>
        <p className="lede">Review the card, then open the edit form to update your details.</p>
      </header>
      {!user && (
        <p className="banner">
          You are viewing a guest card. <Link to="/login">Login</Link> to save changes to your account.
        </p>
      )}
      <ProfileCard
        user={user || { name: 'Guest patient', email: 'guest@stayhealthy.local', phone: '', role: 'patient' }}
        onUpdated={setUser}
      />
      <p className="switch-auth">
        <a href="/patient_report.pdf">Download the sample patient report (PDF)</a>
      </p>
    </div>
  )
}

export default Profile
