const express = require("express");

const router = express.Router();

const upload = require("../config/multerconfig");
const isLoggedIn = require("../middleware/auth");

const userController = require("../controllers/userController");

router.get(
    "/profile",
    isLoggedIn,
    userController.profilePage
);

router.get(
    "/profile/upload",
    isLoggedIn,
    userController.profileUploadPage
);

router.post(
    "/upload",
    isLoggedIn,
    upload.single("image"),
    userController.uploadProfilePicture
);

module.exports = router;