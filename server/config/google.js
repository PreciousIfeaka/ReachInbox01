require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const AUTH_OPTIONS = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true,
};

passport.use(new GoogleStrategy(AUTH_OPTIONS, (request, accessToken, requestToken, profile, done) => {
  console.log("Verified");
  done(null, { profile, accessToken });
}));

// Serialize and deserialize user (necessary for session management)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});