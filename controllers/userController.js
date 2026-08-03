const usermodel = require("../modules/user");
const cloudinary = require("../config/cloudinary");


function toastRedirect(res, path, message, type = "success") {
    res.redirect(`${path}?toast=${encodeURIComponent(message)}&type=${type}`);
}

// ======================
// Profile Page
// ======================
exports.profilePage = async (req, res) => {
    try {
        const user = await usermodel.findOne({ email: req.user.email }).populate({
            path: "posts",
            options: { sort: { date: -1 } }
        });

        if (!user) return res.redirect("/login");

        res.render("profile", { user });

    } catch (err) {
        console.error(err);
        toastRedirect(
            res,
            "/login",
            "Couldn't load your profile. Please log in again.",
            "error"
        );
    }
};

// ======================
// Upload Page
// ======================
exports.profileUploadPage = (req, res) => {
    res.render("profilePic");
};

// ======================
// Upload Profile Picture
// ======================
exports.uploadProfilePicture = async (req, res) => {

    try {

        if (!req.file) {
            return toastRedirect(
                res,
                "/profile/upload",
                "Please choose an image first.",
                "error"
            );
        }

        const user = await usermodel.findOne({
            email: req.user.email,
        });

        /*
        Delete previous Cloudinary image
        */

        if (
            user.profilepic &&
            user.profilepic.includes("cloudinary.com")
        ) {

            try {

                const parts = user.profilepic.split("/");

                const filename = parts[parts.length - 1];

                const publicId =
                    "Mini_Social_App_ProfilePics/" +
                    filename.substring(0, filename.lastIndexOf("."));

                await cloudinary.uploader.destroy(publicId);

            } catch (err) {

                console.log("Old image not deleted.");

            }

        }

        /*
        Save new image
        */

        user.profilepic = req.file.path;

        await user.save();

        toastRedirect(
            res,
            "/profile",
            "Profile photo updated!"
        );

    } catch (err) {

        console.error(err);

        toastRedirect(
            res,
            "/profile/upload",
            "Couldn't upload image.",
            "error"
        );

    }

};