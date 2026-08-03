require("dotenv").config();
const express = require('express');
const path = require('path');
const usermodel = require("./modules/user");
const postmodel = require("./modules/post");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const upload = require('./config/multerconfig');
const session = require("express-session");
const passport = require("./config/passport");
const isLoggedIn = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
connectDB();

const JWT_SECRET = process.env.JWT_SECRET;


app.use(cookieParser());

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", postRoutes);


function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    const units = [
        ['y', 31536000],
        ['mo', 2592000],
        ['d', 86400],
        ['h', 3600],
        ['m', 60]
    ];
    for (const [label, secs] of units) {
        const value = Math.floor(seconds / secs);
        if (value >= 1) return `${value}${label} ago`;
    }
    return seconds < 10 ? 'just now' : `${seconds}s ago`;
}
app.locals.timeAgo = timeAgo;

function toastRedirect(res, path, message, type = 'success') {
    res.redirect(`${path}?toast=${encodeURIComponent(message)}&type=${type}`);
}

// // Google OAuth routes
// app.get(
//     "/auth/google",
//     passport.authenticate("google", {
//         scope: ["profile", "email"],
//     })
// );

// app.get(
//     "/auth/google/callback",
//     passport.authenticate("google", {
//         failureRedirect: "/login",
//     }),
//     (req, res) => {
//         const token = jwt.sign(
//             {
//                 email: req.user.email,
//                 userid: req.user._id,
//             },
//             JWT_SECRET
//         );

//         res.cookie("token", token, {
//             httpOnly: true,
//         });

//         res.redirect("/profile");
//     }
// );

// // Landing page
// app.get('/', (req, res) => {
//     res.render('index');
// });

// // Register form
// app.get('/register', (req, res) => {
//     res.render('register');
// });

// // Register
// app.post('/register', async (req, res) => {
//     let { username, name, email, age, password } = req.body;
//     try {
//         if (!username || !name || !email || !age || !password) {
//             return res.status(400).json({ success: false, message: "Please fill in every field." });
//         }

//         let user = await usermodel.findOne({ email });
//         if (user) return res.status(400).json({ success: false, message: "An account with that email already exists." });

//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password, salt);

//         let newUser = await usermodel.create({
//             name, age, username, email, password: hash
//         });

//         let token = jwt.sign({ email, userid: newUser._id }, JWT_SECRET);
//         res.cookie("token", token, { httpOnly: true });
//         return res.status(201).json({ success: true, redirect: '/profile', message: "Account created! Redirecting..." });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: "Registration failed. Please try again." });
//     }
// });

// // Login form
// app.get('/login', (req, res) => {
//     res.render('login');
// });

// // Login logic
// app.post('/login', async (req, res) => {
//     let { email, password } = req.body;
//     try {
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: "Please enter both email and password." });
//         }

//         let user = await usermodel.findOne({ email });
//         if (!user) return res.status(400).json({ success: false, message: "No account found with that email." });

//         bcrypt.compare(password, user.password, (err, result) => {
//             if (err) return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
//             if (result) {
//                 let token = jwt.sign({ email, userid: user._id }, JWT_SECRET);
//                 res.cookie("token", token, { httpOnly: true });
//                 return res.status(200).json({ success: true, redirect: '/profile', message: "Welcome back!" });
//             } else {
//                 return res.status(401).json({ success: false, message: "Incorrect password. Please try again." });
//             }
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: "Login failed. Please try again." });
//     }
// });

// Profile page
// app.get('/profile', isLoggedIn, async (req, res) => {
//     try {
//         let user = await usermodel.findOne({ email: req.user.email }).populate({
//             path: 'posts',
//             options: { sort: { date: -1 } }
//         });
//         if (!user) return res.redirect('/login');
//         res.render('profile', { user });
//     } catch (err) {
//         console.error(err);
//         toastRedirect(res, '/login', "Couldn't load your profile. Please log in again.", 'error');
//     }
// });

// // Profile pic route
// app.get('/profile/upload', isLoggedIn, (req, res) => {
//     res.render('profilePic');
// });

// app.post('/upload', isLoggedIn, upload.single("image"), async (req, res) => {
//     try {
//         console.log(req.file);

//         if (!req.file)
//             return toastRedirect(res, '/profile/upload', "Please choose an image first.", 'error');

//         let user = await usermodel.findOne({ email: req.user.email });

//         user.profilepic = req.file.path;

//         await user.save();

//         toastRedirect(res, '/profile', "Profile photo updated!");
//     } catch (err) {
//         console.error(err);
//     }
// });

// // Create post
// app.post('/create', isLoggedIn, async (req, res) => {
//     try {
//         let user = await usermodel.findOne({ email: req.user.email });
//         let { content } = req.body;
//         if (!content || content.trim() === "") {
//             return toastRedirect(res, '/profile', "Post can't be empty.", 'error');
//         }

//         let post = await postmodel.create({
//             user: user._id,
//             content: content.trim()
//         });
//         user.posts.push(post._id);
//         await user.save();

//         toastRedirect(res, '/profile', "Post created!");
//     } catch (err) {
//         console.error(err);
//         toastRedirect(res, '/profile', "Couldn't create that post. Please try again.", 'error');
//     }
// });

// // Like route
// app.get('/like/:id', isLoggedIn, async (req, res) => {
//     try {
//         let post = await postmodel.findOne({ _id: req.params.id }).populate('user');
//         if (!post) return toastRedirect(res, '/profile', "That post no longer exists.", 'error');

//         if (post.likes.indexOf(req.user.userid) === -1) {
//             post.likes.push(req.user.userid);
//         } else {
//             post.likes.splice(post.likes.indexOf(req.user.userid), 1);
//         }

//         await post.save();
//         res.redirect('/profile');
//     } catch (err) {
//         console.error(err);
//         toastRedirect(res, '/profile', "Couldn't update your like. Please try again.", 'error');
//     }
// });

// // Edit route
// app.get('/edit/:id', isLoggedIn, async (req, res) => {
//     try {
//         let post = await postmodel.findOne({ _id: req.params.id }).populate('user');
//         if (!post) return toastRedirect(res, '/profile', "That post no longer exists.", 'error');
//         res.render('edit', { post });
//     } catch (err) {
//         console.error(err);
//         toastRedirect(res, '/profile', "Couldn't open that post for editing.", 'error');
//     }
// });

// app.post('/edit/:id', isLoggedIn, async (req, res) => {
//     try {
//         let { content } = req.body;
//         if (!content || content.trim() === "") {
//             return toastRedirect(res, '/profile', "Post can't be empty.", 'error');
//         }
//         await postmodel.findOneAndUpdate({ _id: req.params.id }, { content: content.trim() });
//         toastRedirect(res, '/profile', "Post updated!");
//     } catch (err) {
//         console.error(err);
//         toastRedirect(res, '/profile', "Couldn't save your changes. Please try again.", 'error');
//     }
// });

// Logout
// app.get('/logout', (req, res) => {
//     res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
//     res.redirect('/login');
// });

// // Middleware: Check token
// function isLoggedIn(req, res, next) {
//     try {
//         const token = req.cookies.token;
//         if (!token || token.trim() === "") return res.redirect('/login');
//         const data = jwt.verify(token, JWT_SECRET);
//         req.user = data;
//         next();
//     } catch (err) {
//         res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
//         return res.redirect('/login');
//     }
// }

// 404 — anything unmatched falls back to the landing page
app.use((req, res) => {
    res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ System is running smoothly on http://localhost:${PORT}`);
});


