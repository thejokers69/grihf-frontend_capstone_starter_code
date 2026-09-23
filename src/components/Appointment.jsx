import React, { useState } from 'react'
import FindDoctorSearch from './FindDoctorSearch.jsx'
import AppointmentForm from './AppointmentForm.jsx'
import AppointmentFormIC from './AppointmentFormIC.jsx'
import DoctorCard from './DoctorCard.jsx'

const DIRECTORY = [
  { id: 'leila-benali', name: 'Leila Benali', specialty: 'General practice', location: 'Remote · Morocco' },
  { id: 'omar-haddad', name: 'Omar Haddad', specialty: 'Pediatrics', location: 'Remote · Tunisia' },
  { id: 'sofia-mensah', name: 'Sofia Mensah', specialty: 'Cardiology', location: 'Remote · Ghana' },
  { id: 'priya-nair', name: 'Priya Nair', specialty: 'Mental health', location: 'Remote · India' }
]

const Appointment = () => {
  const [results, setResults] = useState(DIRECTORY)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(DIRECTORY[0])
  const [booked, setBooked] = useState([
    {
      id: 'sample-visit',
      doctorName: 'Leila Benali',
      specialty: 'General practice',
      name: 'Amina El Fassi',
      phone: '+212612345678',
      date: '2026-09-24',
      time: '10:30',
      type: 'scheduled'
    }
  ])

  const addBooking = (appointment) => {
    const doctor = DIRECTORY.find((item) => item.name === appointment.doctorName)
    setBooked((current) => [
      {
        ...appointment,
        specialty: doctor?.specialty || appointment.specialty || 'General practice'
      },
      ...current
    ])
  }

  return (
    <div className="page">
      <header className="page-head">
        <p className="kicker">Appointment booking</p>
        <h1>Find a doctor and reserve a visit</h1>
        <p className="lede">Search the directory, then book an instant call or a scheduled appointment.</p>
      </header>

      <FindDoctorSearch
        doctors={DIRECTORY}
        onResults={(matches, term) => {
          setResults(matches)
          setQuery(term)
        }}
      />
      <p className="result-count">
        {query
          ? `${results.length} ${results.length === 1 ? 'doctor' : 'doctors'} matching “${query}”`
          : `${results.length} ${results.length === 1 ? 'doctor' : 'doctors'} available`}
      </p>

      <div className="booking-layout">
        <section aria-label="Doctor directory">
          <ul className="doctor-list">
            {results.map((doctor) => (
              <li key={doctor.id}>
                <button
                  type="button"
                  className={selected?.id === doctor.id ? 'doctor-pick selected' : 'doctor-pick'}
                  onClick={() => setSelected(doctor)}
                >
                  <strong>Dr. {doctor.name}</strong>
                  <span>{doctor.specialty}</span>
                  <span className="muted">{doctor.location}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="empty">No doctors match that search.</li>}
          </ul>
        </section>

        <section className="booking-forms" aria-label="Booking forms">
          <AppointmentFormIC onBooked={addBooking} />
          <AppointmentForm doctorName={selected?.name} onBooked={addBooking} />
        </section>
      </div>

      <section className="booked-list" aria-label="Your appointments">
        <h2>Your appointments</h2>
        {booked.length === 0 && <p className="muted">No appointments yet.</p>}
        {booked.map((appointment) => (
          <DoctorCard
            key={appointment.id}
            appointment={appointment}
            onCancelled={(id) => setBooked((current) => current.filter((item) => item.id !== id))}
          />
        ))}
      </section>
    </div>
  )
}

export default Appointment
