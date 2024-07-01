require("dotenv").config();
require("./config/google");
const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const { googleRouter } = require("./router/google.router");
const scheduleRouter = require("./router/schedule.router");
const { OAuth2Client, authUrl } = require("./config/google");

const app = express();
app.use(express.json());


app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', (req, res) => {
  authUrl;
  res.redirect(authUrl);
});

// app.use("/google", googleRouter);
app.use("/google", scheduleRouter);

// callback routes
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await OAuth2Client.getToken(code);
    OAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;
    res.redirect("/google/emails");
  } catch (error) {
    res.status(500).send('Authentication failed!');
  }
});

module.exports = app;