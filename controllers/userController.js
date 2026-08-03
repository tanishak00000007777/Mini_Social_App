const usermodel = require("../modules/user");
const cloudinary = require("../config/cloudinary");


function toastRedirect(res, path, message, type = "success") {
    res.redirect(`${path}?toast=${encodeURIComponent(message)}&type=${type}`);
}

// Turns a date into a local YYYY-MM-DD key so streaks are computed against
// the day the person actually wrote, not a UTC-shifted date.
function dayKey(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

// Builds streak stats + a 12-week activity map from a list of post timestamps.
function computeStreaks(posts) {
    const daysWithEntries = new Set(posts.map(p => dayKey(p.createdAt)));

    // Current streak: walk backward from today (or yesterday, if nothing
    // written yet today) until a day with no entry is found.
    let current = 0;
    let cursor = new Date();
    if (!daysWithEntries.has(dayKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }
    while (daysWithEntries.has(dayKey(cursor))) {
        current++;
        cursor.setDate(cursor.getDate() - 1);
    }

    // Longest streak across all-time entries.
    const sortedDays = Array.from(daysWithEntries).sort();
    let longest = 0, running = 0, prev = null;
    for (const key of sortedDays) {
        if (prev) {
            const diff = (new Date(key) - new Date(prev)) / 86400000;
            running = diff === 1 ? running + 1 : 1;
        } else {
            running = 1;
        }
        longest = Math.max(longest, running);
        prev = key;
    }

    // Activity map: last 84 days (12 weeks), oldest first, for the heatmap.
    const heatmap = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = dayKey(d);
        heatmap.push({ date: key, active: daysWithEntries.has(key) });
    }

    return {
        currentStreak: current,
        longestStreak: longest,
        totalDaysWritten: daysWithEntries.size,
        heatmap
    };
}

// ======================
// Profile Page
// ======================
exports.profilePage = async (req, res) => {
    try {
        const user = await usermodel.findOne({ email: req.user.email }).populate({
            path: "posts",
            options: { sort: { createdAt: -1 } }
        });

        if (!user) return res.redirect("/login");

        const streaks = computeStreaks(user.posts);

        res.render("profile", { user, streaks });

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