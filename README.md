# Medical Appointment Booking

**Project name:** Medical Appointment Booking

Medical Appointment Booking is the StayHealthy front-end capstone. StayHealthy is a non-profit healthcare platform for the Go Digital initiative. It helps patients in remote and underserved areas book a doctor online, anytime and from anywhere.

This repository contains the static layout pages and the React application used for the final project, plus setup instructions.

Live site: https://medical-booking-layouts.vercel.app/

## What you can do in the app

- Create an account (role, name, email, phone, password) and log in
- Search doctors and book an instant consultation or a scheduled visit
- Cancel an appointment from the doctor card
- Submit a review (the form locks after it is sent)
- View and edit a profile card
- Read a sample patient report with prescription details

## Setup

Requirements: Node.js 18 or newer.

```bash
npm install
npm run report
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:3001

Production build and server:

```bash
npm run build
npm start
```

The API listens on `0.0.0.0` and uses the `PORT` environment variable when it is set.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/appointments` | Book a visit |
| DELETE | `/api/appointments/:id` | Cancel a visit |
| POST | `/api/reviews` | Submit a review |
| PUT | `/api/profile` | Update the signed-in profile |

## Project layout

```
index.html                         SEO meta tags
src/App.jsx                        Notification provider for the whole app
src/components/Sign_Up.jsx         Registration API
src/components/Login.jsx           Login API
src/components/Navbar.jsx          Logout
src/components/FindDoctorSearch.jsx
src/components/AppointmentForm.jsx Name, phone, date, and time
src/components/AppointmentFormIC.jsx Name and phone only
src/components/GiveReviews.jsx
src/components/ProfileCard.jsx
src/components/DoctorCard.jsx      Cancel appointment
server/server.js
patient_report.pdf
Landing_Page/  Login/  Navbar/  Sign_up/   earlier static layouts
```

## Static layouts

The first HTML screens still open on their own:

```bash
python3 -m http.server 8080
```

Home: http://localhost:8080/Landing_Page/LandingPage.html
