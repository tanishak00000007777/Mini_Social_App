# Etch

A daily journal app built with Node.js, Express, and MongoDB. Write an entry, build a streak, favorite the ones that matter — entries can be edited, but never deleted, so the record stays honest. Auth supports both email/password and Google OAuth, with profile photos hosted on Cloudinary.

## Features

- Email/password authentication (JWT stored in an httpOnly cookie) and Google OAuth via Passport
- Password hashing with bcrypt
- Write and edit entries — deletion is intentionally not supported
- Favorite entries to revisit them later, with a dedicated Favorites filter
- Writing streaks: current streak, longest streak, and a 12-week activity heatmap
- Profile photo upload, stored on Cloudinary (old photo is cleaned up on replace)
- Toast notifications for all auth and entry actions — no raw error pages, no full-page reloads on login/register
- Server-rendered EJS views with a shared design system (Tailwind CDN + custom CSS)

## Tech Stack

- **Backend:** Node.js, Express 5, MongoDB, Mongoose
- **Auth:** JWT + httpOnly cookies, Passport (Google OAuth 2.0)
- **Views:** EJS, Tailwind CSS (CDN), vanilla JS
- **Media storage:** Cloudinary (via Multer)

## Project Structure

```
├── app.js                  # App entry point — middleware, route mounting, server start
├── config/
│   ├── database.js         # MongoDB connection
│   ├── cloudinary.js       # Cloudinary config
│   ├── multerconfig.js     # Multer + Cloudinary storage
│   └── passport.js         # Google OAuth strategy
├── middleware/
│   └── auth.js             # JWT auth guard (isLoggedIn)
├── modules/
│   ├── user.js              # User schema
│   └── post.js              # Entry (post) schema
├── controllers/
│   ├── authController.js   # Register / login / logout / Google OAuth
│   ├── userController.js   # Profile, streaks, photo upload
│   └── postController.js   # Create / favorite / edit entries
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── postRoutes.js
├── views/                   # EJS templates + shared partials (head, navbar, toast)
└── public/                  # Stylesheets, client-side JS, static assets
```

## Setup

1. Clone the repo and install dependencies

   ```bash
   git clone https://github.com/tanishak00000007777/Mini_Social_App.git
   cd Mini_Social_App
   npm install
   ```

2. Create a `.env` file in the project root (see `.env.example`):

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   Google OAuth is optional — the app works with email/password alone if you skip those two vars, though `config/passport.js` still expects them to be defined (leave them blank rather than omitting them).

3. Start the server

   ```bash
   npm start        # node app.js
   npm run dev       # nodemon app.js, for local development
   ```

4. Visit `http://localhost:3000`

## License

Open-source and free to use — feel free to modify and build on it.

## Author

Tanishak Bansal
GitHub: [@tanishak00000007777](https://github.com/tanishak00000007777)
