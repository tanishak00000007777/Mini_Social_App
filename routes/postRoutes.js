const express = require("express");

const router = express.Router();

const isLoggedIn = require("../middleware/auth");

const postController = require("../controllers/postController");

router.post(
    "/create",
    isLoggedIn,
    postController.createPost
);

router.get(
    "/like/:id",
    isLoggedIn,
    postController.likePost
);

router.get(
    "/edit/:id",
    isLoggedIn,
    postController.editPage
);

router.post(
    "/edit/:id",
    isLoggedIn,
    postController.updatePost
);

module.exports = router;