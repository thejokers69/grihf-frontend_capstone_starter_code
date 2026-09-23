import React, { useMemo, useState } from 'react'

const FindDoctorSearch = ({ doctors, onResults }) => {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return doctors
    return doctors.filter((doctor) => {
      const haystack = `${doctor.name} ${doctor.specialty} ${doctor.location}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [doctors, query])

  const runSearch = (event) => {
    event.preventDefault()
    onResults(matches, query.trim())
  }

  return (
    <form className="search-bar" onSubmit={runSearch} role="search">
      <label htmlFor="doctor-search">Find a doctor</label>
      <div className="search-row">
        <input
          id="doctor-search"
          type="search"
          value={query}
          placeholder="Search by name, specialty, or location"
          onChange={(event) => {
            const next = event.target.value
            setQuery(next)
            const needle = next.trim().toLowerCase()
            const live = !needle
              ? doctors
              : doctors.filter((doctor) =>
                `${doctor.name} ${doctor.specialty} ${doctor.location}`.toLowerCase().includes(needle)
              )
            onResults(live, next.trim())
          }}
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </div>
    </form>
  )
}

export default FindDoctorSearch
