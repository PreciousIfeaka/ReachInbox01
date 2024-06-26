const passport = require("passport");
const OutlookStrategy = require("passport-outlook").Strategy;
require("dotenv").config()

//passport strategy
passport.use(new OutlookStrategy({
  clientID: process.env.OUTLOOK_CLIENT_ID,
  clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/outlook/callback",
  authorizationURL: "https://login.microsoftonline.com/common/oauth2/authorize",
  tokenURL: "https://login.microsoftonline.com/common/oauth2/token",
  passReqToCallback: true,
  scope: ['openid', 'profile', 'https://outlook.office.com/mail.read'],
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken });
}));

// Serialize and deserialize user (necessary for session management)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
