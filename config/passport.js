const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../modules/user");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const email = profile.emails[0].value;

                // 1. Find by Google ID
                let user = await User.findOne({
                    googleId: profile.id,
                });

                if (user) {
                    return done(null, user);
                }

                // 2. Find by Email
                user = await User.findOne({
                    email,
                });

                if (user) {

                    // Link existing account with Google
                    user.googleId = profile.id;
                    user.provider = "google";

                    // Update profile picture
                    if (!user.profilepic || user.profilepic.includes("sample")) {
                        user.profilepic = profile.photos[0].value;
                    }

                    await user.save();

                    return done(null, user);
                }

                // 3. Create new Google user
                user = await User.create({

                    username: email.split("@")[0],

                    name: profile.displayName,

                    email,

                    provider: "google",

                    googleId: profile.id,

                    password: null,

                    age: 0,

                    profilepic: profile.photos[0].value,

                });

                return done(null, user);

            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {

    try {

        const user = await User.findById(id);

        done(null, user);

    } catch (err) {

        done(err, null);

    }

});

module.exports = passport;