# Login & Signup System – EGOBAR

A modern authentication system built with **Next.js App Router**, featuring secure signup, email verification, OTP-based login, and JWT authentication.

This project demonstrates my ability to design **real-world authentication flows**, handle **secure credentials**, and build **polished UI experiences**.

---

## ✨ Features

- 🔐 **User Authentication**
  - Secure signup with password hashing (bcrypt)
  - JWT-based authentication with HttpOnly cookies
  - Logout with proper session invalidation

- 📧 **Email Verification**
  - Verification link sent on signup
  - Token expiration handling
  - Resend verification support

- 🔑 **OTP Login (2-Step Authentication)**
  - One-time passcode sent to email
  - Time-limited OTP validation
  - OTP verification before dashboard access

- 👤 **User Profile**
  - Avatar upload & removal
  - Protected routes (dashboard, profile, settings)

- 🎨 **Modern UI**
  - Responsive design
  - Animated search input
  - Gradient-based action buttons
  - Clean dashboard layout

---

## 🖥️ Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Sign Up
![Sign Up](screenshots/signup.png)

### Sign In + OTP Verification
![Sign In](screenshots/signin-otp.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

> 📌 Screenshots are stored in the `/screenshots` folder.

---

## 🧰 Tech Stack

- **Frontend**
  - Next.js (App Router)
  - React
  - Tailwind CSS
  - React Icons

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL

- **Authentication & Security**
  - JWT (HttpOnly cookies)
  - bcrypt password hashing
  - Email verification tokens
  - OTP-based login verification

- **Email**
  - Nodemailer (Gmail SMTP)

---

## 🔒 Security Practices

- Passwords are **never stored in plaintext**
- JWT stored in **HttpOnly cookies**
- Environment variables used for all secrets
- Verification & OTP tokens expire automatically
- Protected routes redirect unauthenticated users

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
