const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token || token.trim() === "") {
            return res.redirect("/login");
        }

        const data = jwt.verify(token, JWT_SECRET);

        req.user = data;

        next();
    } catch (err) {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        return res.redirect("/login");
    }
}

module.exports = isLoggedIn;