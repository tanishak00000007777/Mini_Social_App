require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
connectDB();

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", postRoutes);

// Human-readable relative time, e.g. "3h ago". Available in every view.
function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    const units = [
        ["y", 31536000],
        ["mo", 2592000],
        ["d", 86400],
        ["h", 3600],
        ["m", 60]
    ];
    for (const [label, secs] of units) {
        const value = Math.floor(seconds / secs);
        if (value >= 1) return `${value}${label} ago`;
    }
    return seconds < 10 ? "just now" : `${seconds}s ago`;
}
app.locals.timeAgo = timeAgo;

// Unmatched routes fall back to the landing page
app.use((req, res) => {
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ System is running smoothly on http://localhost:${PORT}`);
});
