const postmodel = require("../modules/post");
const usermodel = require("../modules/user");

function toastRedirect(res, path, message, type = "success") {
    res.redirect(`${path}?toast=${encodeURIComponent(message)}&type=${type}`);
}

// ======================
// Create Post
// ======================
exports.createPost = async (req, res) => {
    try {
        const user = await usermodel.findOne({ email: req.user.email });

        const { content } = req.body;

        if (!content || content.trim() === "") {
            return toastRedirect(
                res,
                "/profile",
                "Post can't be empty.",
                "error"
            );
        }

        const post = await postmodel.create({
            user: user._id,
            content: content.trim(),
        });

        user.posts.push(post._id);

        await user.save();

        toastRedirect(res, "/profile", "Post created!");
    } catch (err) {
        console.error(err);

        toastRedirect(
            res,
            "/profile",
            "Couldn't create that post.",
            "error"
        );
    }
};

// ======================
// Like / Unlike
// ======================
exports.likePost = async (req, res) => {
    try {
        const post = await postmodel
            .findById(req.params.id)
            .populate("user");

        if (!post) {
            return toastRedirect(
                res,
                "/profile",
                "Post no longer exists.",
                "error"
            );
        }

        if (post.likes.includes(req.user.userid)) {
            post.likes.pull(req.user.userid);
        } else {
            post.likes.push(req.user.userid);
        }

        await post.save();

        res.redirect("/profile");
    } catch (err) {
        console.error(err);

        toastRedirect(
            res,
            "/profile",
            "Couldn't update like.",
            "error"
        );
    }
};

// ======================
// Edit Page
// ======================
exports.editPage = async (req, res) => {
    try {
        const post = await postmodel
            .findById(req.params.id)
            .populate("user");

        if (!post) {
            return toastRedirect(
                res,
                "/profile",
                "Post no longer exists.",
                "error"
            );
        }

        res.render("edit", { post });
    } catch (err) {
        console.error(err);

        toastRedirect(
            res,
            "/profile",
            "Couldn't open edit page.",
            "error"
        );
    }
};

// ======================
// Update Post
// ======================
exports.updatePost = async (req, res) => {
    try {

        const { content } = req.body;

        if (!content || content.trim() === "") {
            return toastRedirect(
                res,
                "/profile",
                "Post can't be empty.",
                "error"
            );
        }

        await postmodel.findByIdAndUpdate(
            req.params.id,
            {
                content: content.trim(),
            }
        );

        toastRedirect(
            res,
            "/profile",
            "Post updated!"
        );

    } catch (err) {

        console.error(err);

        toastRedirect(
            res,
            "/profile",
            "Couldn't update post.",
            "error"
        );
    }
};