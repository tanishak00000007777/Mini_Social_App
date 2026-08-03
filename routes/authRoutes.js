const express = require("express");
const passport = require("passport");

const authController = require("../controllers/authController");

const router = express.Router();

// Home
router.get("/", authController.home);

// Register
router.get("/register", authController.registerPage);
router.post("/register", authController.registerUser);

// Login
router.get("/login", authController.loginPage);
router.post("/login", authController.loginUser);

// Logout
router.get("/logout", authController.logoutUser);

// Google OAuth
router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
    }),
    authController.googleCallback
);

module.exports = router;