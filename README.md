# ETCH

A modern social media web application built with **Node.js, Express.js, MongoDB Atlas, JWT Authentication, Google OAuth 2.0, Cloudinary, and Render**.

Loop allows users to securely register, log in, create and edit posts, upload profile pictures, and authenticate using Google. The application follows the MVC architecture and is deployed on Render for public access.

---

# 🚀 Live Demo

🔗 https://mini-social-app-n1tc.onrender.com

---

# 📸 Project Screenshots

## 🏠 Landing Page

> *(Add Screenshot Here)*

![Landing Page](screenshots/home.png)

---

## 🔐 Login Page

> *(Add Screenshot Here)*

![Login](screenshots/login.png)

---

## 📝 Register Page

> *(Add Screenshot Here)*

![Register](screenshots/register.png)

---

## 👤 User Dashboard

> *(Add Screenshot Here)*

![Dashboard](screenshots/dashboard.png)

---

## 📷 Profile Picture Upload

> *(Add Screenshot Here)*

![Profile Upload](screenshots/profile-upload.png)

---

## 📝 Create & Manage Posts

> *(Add Screenshot Here)*

![Posts](screenshots/posts.png)

---

# ✨ Features

### Authentication

- Secure User Registration
- Secure Login
- JWT Authentication
- Google OAuth 2.0 Login
- Protected Routes
- Secure Logout

### User Profile

- Personalized Dashboard
- Update Profile Picture
- Cloudinary Image Storage
- Automatic Replacement of Previous Profile Picture

### Posts

- Create Posts
- Edit Existing Posts
- Like / Unlike Posts
- View Personal Feed

### Backend

- MVC Architecture
- RESTful Routing
- MongoDB Atlas Database
- Cloudinary Integration
- Passport Google OAuth
- Environment Variable Configuration

### Deployment

- Render Hosting
- MongoDB Atlas
- Cloudinary CDN
- Production Environment Variables

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- Tailwind CSS
- EJS
- JavaScript

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## Authentication

- JWT
- Passport.js
- Google OAuth 2.0
- bcrypt

## Cloud

- Cloudinary
- Render

---

# 📂 Folder Structure

```
mini_backend/
│
├── config/
│   ├── cloudinary.js
│   ├── database.js
│   ├── multerconfig.js
│   └── passport.js
│
├── controllers/
│   ├── authController.js
│   ├── postController.js
│   └── userController.js
│
├── middleware/
│   └── auth.js
│
├── modules/
│   ├── post.js
│   └── user.js
│
├── public/
│
├── routes/
│   ├── authRoutes.js
│   ├── postRoutes.js
│   └── userRoutes.js
│
├── views/
│
├── app.js
└── package.json
```

---

# 🔒 Environment Variables

Create a `.env` file.

```env
MONGO_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_CALLBACK_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Run the project

```bash
npm start
```

---

# 🌍 Deployment

The application is deployed using **Render**.

Deployment includes:

- MongoDB Atlas
- Cloudinary
- Google OAuth Production Configuration
- Environment Variables
- Secure JWT Authentication

---

# 📈 Future Improvements

- Image Posts
- Comments
- Notifications
- Follow / Unfollow System
- Dark Mode
- Infinite Scrolling

---

# 👨‍💻 Author

**Tanishak Bansal**

Computer Engineering Undergraduate

Thapar Institute of Engineering & Technology

---
