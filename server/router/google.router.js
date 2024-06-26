const express = require("express");
const axios = require("axios");
require("../config/google");

const googleRouter = express();

googleRouter.get("/emails", async (req, res) => {
  if (!req.isAuthenticated()) {
      return res.redirect('/');
  }
  console.log("Authed");
  const { accessToken } = req.user;

  // Use the access token to access the google API

  try {
    const response = await axios.get("https://www.googleapis.com/gmail/v1/users/me/messages", {
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  })
  const messages = response.data.messages;
  const fullMessages = await Promise.all(messages.map(async (message) => {
    const messageResponse = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return messageResponse.data;
  }));
  
  res.json(fullMessages);
  } catch(error) {
    res.status(500).send(error);
  }
});

module.exports = googleRouter;