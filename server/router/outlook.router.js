const express = require("express");
require("../config/outlook");

const outlookRouter = express();

outlookRouter.get("/emails", (req, res) => {
  if (!req.isAuthenticated()) {
      return res.redirect('/');
  }

  const { accessToken } = req.user;

  // Use the access token to access the Outlook API

  axios.get('https://graph.microsoft.com/v1.0/me/messages', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => res.status(500).send('Error fetching emails'));
});