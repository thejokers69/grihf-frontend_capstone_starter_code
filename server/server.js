import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const dbPath = path.join(dataDir, 'db.json')
const distDir = path.join(__dirname, '..', 'dist')

const emptyDb = () => ({
  users: [],
  appointments: [
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
  ],
  reviews: []
})

const loadDb = () => {
  if (!fs.existsSync(dbPath)) return emptyDb()
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'))
}

const saveDb = (db) => {
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.scryptSync(password, salt, 32).toString('hex')
  return `${salt}:${hash}`
}

const checkPassword = (password, stored) => {
  const [salt, hash] = stored.split(':')
  const next = crypto.scryptSync(password, salt, 32).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(next, 'hex'))
}

const publicUser = (user) => ({
  id: user.id,
  role: user.role,
  name: user.name,
  email: user.email,
  phone: user.phone
})

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'success', service: 'stayhealthy' })
})

app.post('/api/auth/register', (req, res) => {
  const { role, name, email, phone, password } = req.body || {}
  if (!role || !name || !email || !phone || !password) {
    return res.status(400).json({ status: 'error', message: 'Role, name, email, phone, and password are required.' })
  }
  if (String(password).length < 8) {
    return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters.' })
  }
  const db = loadDb()
  const existing = db.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase())
  if (existing) {
    return res.status(409).json({ status: 'error', message: 'An account with that email already exists.' })
  }
  const user = {
    id: crypto.randomUUID(),
    role,
    name,
    email,
    phone,
    passwordHash: hashPassword(password),
    token: crypto.randomBytes(24).toString('hex')
  }
  db.users.push(user)
  saveDb(db)
  return res.status(201).json({
    status: 'success',
    message: 'User registered.',
    authtoken: user.token,
    user: publicUser(user)
  })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password are required.' })
  }
  const db = loadDb()
  const user = db.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase())
  if (!user || !checkPassword(password, user.passwordHash)) {
    return res.status(401).json({ status: 'error', message: 'Invalid email or password.' })
  }
  user.token = crypto.randomBytes(24).toString('hex')
  saveDb(db)
  return res.json({
    status: 'success',
    message: 'Login successful.',
    authtoken: user.token,
    token: user.token,
    user: publicUser(user)
  })
})

app.post('/api/appointments', (req, res) => {
  const { name, phone, date, time, doctorName, type } = req.body || {}
  if (!name || !phone) {
    return res.status(400).json({ status: 'error', message: 'Name and phone number are required.' })
  }
  if (type !== 'instant' && (!date || !time)) {
    return res.status(400).json({ status: 'error', message: 'Date and time are required for a scheduled visit.' })
  }
  const db = loadDb()
  const appointment = {
    id: crypto.randomUUID(),
    name,
    phone,
    date: date || '',
    time: time || '',
    doctorName: doctorName || 'On-call clinician',
    type: type || 'scheduled'
  }
  db.appointments.push(appointment)
  saveDb(db)
  return res.status(201).json({ status: 'success', appointment })
})

app.delete('/api/appointments/:id', (req, res) => {
  const db = loadDb()
  const before = db.appointments.length
  db.appointments = db.appointments.filter((item) => item.id !== req.params.id)
  if (db.appointments.length === before) {
    return res.status(404).json({ status: 'error', message: 'Appointment not found.' })
  }
  saveDb(db)
  return res.json({ status: 'success', message: 'Appointment cancelled.' })
})

app.post('/api/reviews', (req, res) => {
  const { name, email, rating, review } = req.body || {}
  if (!name || !email || !rating || !review) {
    return res.status(400).json({ status: 'error', message: 'Name, email, rating, and review are required.' })
  }
  const db = loadDb()
  const entry = { id: crypto.randomUUID(), name, email, rating, review }
  db.reviews.push(entry)
  saveDb(db)
  return res.status(201).json({ status: 'success', review: entry })
})

app.put('/api/profile', (req, res) => {
  const header = req.get('authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '')
  const { name, email, phone } = req.body || {}
  if (!name || !email || !phone) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and phone are required.' })
  }
  const db = loadDb()
  const user = db.users.find((item) => item.token === token)
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Login before updating a profile.' })
  }
  user.name = name
  user.email = email
  user.phone = phone
  saveDb(db)
  return res.json({ status: 'success', user: publicUser(user) })
})

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ status: 'error', message: 'Not found' })
    }
    return res.sendFile(path.join(distDir, 'index.html'), (error) => {
      if (error) next(error)
    })
  })
}

const port = Number(process.env.PORT) || 3001
app.listen(port, '0.0.0.0', () => {
  console.log(`StayHealthy API listening on ${port}`)
})
