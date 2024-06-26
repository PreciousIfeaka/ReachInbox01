require("dotenv").config();
require("./config/google");
const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const googleRouter = require("./router/google.router");
const outlookRouter = require("./router/outlook.router");

const app = express();
app.use(express.json());


app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Authentication routes
app.get("/auth/google",
  passport.authenticate('google', {
    scope: ['openid', 'profile', 'email', 'https://mail.google.com/']
  })
);

app.use("/google", googleRouter);

// callback routes
app.get("/auth/google/callback",
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: "/google/emails"
  }),
  (req, res) => {
    console.log("Redirected");
  }
);

module.exports = app;