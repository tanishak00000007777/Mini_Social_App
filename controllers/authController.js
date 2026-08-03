const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const usermodel = require("../modules/user");

const JWT_SECRET = process.env.JWT_SECRET;

// ======================
// Home Page
// ======================
exports.home = (req, res) => {
    res.render("index");
};

// ======================
// Register Page
// ======================
exports.registerPage = (req, res) => {
    res.render("register");
};

// ======================
// Register User
// ======================
exports.registerUser = async (req, res) => {
    const { username, name, email, age, password } = req.body;

    try {
        if (!username || !name || !email || !age || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in every field.",
            });
        }

        const user = await usermodel.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "An account with that email already exists.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await usermodel.create({
            username,
            name,
            email,
            age,
            password: hash,
        });

        const token = jwt.sign(
            {
                email: newUser.email,
                userid: newUser._id,
            },
            JWT_SECRET
        );

        res.cookie("token", token, {
            httpOnly: true,
        });

        return res.status(201).json({
            success: true,
            redirect: "/profile",
            message: "Account created! Redirecting...",
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
        });
    }
};

// ======================
// Login Page
// ======================
exports.loginPage = (req, res) => {
    res.render("login");
};

// ======================
// Login User
// ======================
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter both email and password.",
            });
        }

        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No account found with that email.",
            });
        }

        bcrypt.compare(password, user.password, (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong. Please try again.",
                });
            }

            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password. Please try again.",
                });
            }

            const token = jwt.sign(
                {
                    email: user.email,
                    userid: user._id,
                },
                JWT_SECRET
            );

            res.cookie("token", token, {
                httpOnly: true,
            });

            return res.status(200).json({
                success: true,
                redirect: "/profile",
                message: "Welcome back!",
            });

        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
        });
    }
};

// ======================
// Logout
// ======================
exports.logoutUser = (req, res) => {

    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.redirect("/login");
};

// ======================
// Google OAuth
// ======================
exports.googleCallback = (req, res) => {

    const token = jwt.sign(
        {
            email: req.user.email,
            userid: req.user._id,
        },
        JWT_SECRET
    );

    res.cookie("token", token, {
        httpOnly: true,
    });

    res.redirect("/profile");
};