import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Sign_Up from './components/Sign_Up.jsx'
import Login from './components/Login.jsx'
import Appointment from './components/Appointment.jsx'
import Reviews from './components/Reviews.jsx'
import Profile from './components/Profile.jsx'
import { NotificationProvider } from './components/Notification.jsx'

const App = () => {
  return (
    <NotificationProvider>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Sign_Up />} />
            <Route path="/login" element={<Login />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/search/doctors/:specialty" element={<Appointment />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <p>StayHealthy · Go Digital · Care for remote and underserved communities</p>
        </footer>
      </div>
    </NotificationProvider>
  )
}

export default App
