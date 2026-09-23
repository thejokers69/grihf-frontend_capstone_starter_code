import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const DOCTOR_SPECIALTIES = [
  'General practice',
  'Pediatrics',
  'Cardiology',
  'Mental health',
  'Dermatology',
  'Dentist'
]

const FindDoctorSearch = () => {
  const navigate = useNavigate()
  const [specialtyQuery, setSpecialtyQuery] = useState('')
  const [showSpecialties, setShowSpecialties] = useState(true)

  const selectableSpecialties = useMemo(() => {
    const needle = specialtyQuery.trim().toLowerCase()
    if (!needle) return DOCTOR_SPECIALTIES
    return DOCTOR_SPECIALTIES.filter((specialty) => specialty.toLowerCase().includes(needle))
  }, [specialtyQuery])

  const selectSpecialty = (specialty) => {
    setSpecialtyQuery(specialty)
    setShowSpecialties(false)
    navigate(`/search/doctors/${encodeURIComponent(specialty)}`)
  }

  return (
    <div className="doctor-search">
      <label htmlFor="specialty-search">Search doctors by specialty</label>
      <input
        id="specialty-search"
        type="search"
        value={specialtyQuery}
        placeholder="Choose a specialty"
        onFocus={() => setShowSpecialties(true)}
        onChange={(event) => {
          setSpecialtyQuery(event.target.value)
          setShowSpecialties(true)
        }}
      />
      {showSpecialties && (
        <ul className="specialty-list" aria-label="Selectable doctor specialties">
          {selectableSpecialties.map((specialty) => (
            <li key={specialty}>
              <button type="button" onClick={() => selectSpecialty(specialty)}>
                {specialty}
              </button>
            </li>
          ))}
          {selectableSpecialties.length === 0 && <li className="empty">No specialties match that search.</li>}
        </ul>
      )}
    </div>
  )
}

export default FindDoctorSearch
