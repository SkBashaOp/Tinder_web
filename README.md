# 🔥 devfind

**devFind** is a platform designed specifically for developers to connect, network, and find potential collaborators or friends in the tech industry. It features a modern, Tinder-like swipe interface built with React and a robust Node.js backend.

---

## ✨ Application Features

### 💻 Frontend (User Experience)
- **Tinder-like Swipe Interface**: Effortlessly swipe right (Interested) or left (Ignore) on developer profiles using Framer Motion swipe gestures.
- **Real-Time Match Feed**: Dynamic matching feed that automatically updates when you swipe or navigate to the page.
- **Live Chat Messaging**: Once matched, engage in real-time conversations with your connections using WebSockets.
- **Push Notifications**: Receive instant Firebase Cloud Message (FCM) notifications (both via browser toast and system notifications) when you get a new message or connection request.
- **Profile Management**: Update your developer profile, including your tech stack (skills), bio, age, gender, and profile picture (integrated with Cloudinary).
- **Match Connections & Pending Requests**: View your accepted connections, and review (Accept/Reject) pending incoming requests. 
- **Premium Subscription Tier**: Upgraded account features powered by Razorpay payment gateway integration.
- **Dark/Light Mode**: Full theme customization built-in.
- **Responsive Modern UI**: Beautiful gradients, glassmorphism, shimmer loading states, and animations built with Tailwind CSS and Radix UI.

### ⚙️ Backend (API & Architecture)
- **RESTful API**: Built with Node.js and Express.js covering authentication, profile management, connection requests, and feed delivery.
- **Secure Authentication**: JWT (JSON Web Tokens) for session management and bcrypt for secure password hashing.
- **Real-Time Sockets**: `Socket.io` integration for instant chat messaging, typing indicators, read receipts, and online/offline presence tracking.
- **Database Architecture**: MongoDB (using Mongoose) with optimized schemas for Users, ConnectionRequests, and Chat Messages.
- **Schema Validations**: Comprehensive data sanitization and validation using the `validator` package to ensure clean data (emails, URLs, passwords).
- **Firebase Admin Integration**: Backend securely triggers push notifications to devices using Firebase Admin SDK.
- **Cron Jobs**: Automated background tasks (`node-cron`) for tasks like database cleanup or expiring boosted profiles.
- **Email Services**: Integration with AWS SDK (SES) for sending OTPs or transactional emails.
- **Optimized Feed Algorithm**: Smart query filtering to ensure users don't see profiles they've already swiped on or matched with.

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 & Vite
- Redux Toolkit (State Management)
- Tailwind CSS & DaisyUI
- Framer Motion (Animations & Swipe Gestures)
- Socket.io-client (Real-time events)
- Firebase (Push Notifications)
- React Router DOM

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io
- JSON Web Token (JWT) & Bcrypt
- Firebase Admin SDK
- Razorpay SDK (Payments)
- AWS SES (Emails)

---

## 🚀 Getting Started

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
npm install

# Start development server (using nodemon)
npm run dev
```

> **Note:** Ensure you have `.env` files correctly configured for both the frontend (Vite/Firebase variables) and backend (MongoDB URI, JWT secret, Razorpay keys, AWS credentials) before running the application locally.
