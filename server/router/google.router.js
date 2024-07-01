const he = require("he");
require("../config/google");
const axios = require("axios");
const express = require("express");
const { google } = require("googleapis");
const cohereRespond = require("../ai_utils/cohere.client");
const { OAuth2Client } = require("../config/google");

const googleRouter = express();
let cohereResponseText = "";
let messageObj;
  
async function emails(authtokens) {
  try {
    OAuth2Client.setCredentials(authtokens);

    const gmail = google.gmail({ version: 'v1', auth: OAuth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    // extract the recent mail metadata
    const newMessageId = response.data.messages[0].id;

    const messageResp = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${newMessageId}`, {
      headers: {
        Authorization: `Bearer ${authtokens.access_token}`
      }
    });

    // Extract sender, timestamp, and content
    const headers = await messageResp.data.payload.headers;
    const sender = await headers.find(header => header.name === 'From').value;
    const subject = await headers.find(header => header.name === 'Subject').value;
    const timestamp = new Date(parseInt(messageResp.data.internalDate));
    const parts = await messageResp.data.payload.parts || [messageResp.data.payload];
    const labels = await messageResp.data.labelIds;
    const snippet = await messageResp.data.snippet
    let text = '';

    await parts.forEach(part => {
      if (part.mimeType === 'text/plain') {
        text = he.decode(Buffer.from(part.body.data, 'base64').toString('utf8'));
      }
    });

    messageObj = {
      timestamp,
      subject,
      labels,
      snippet,
      sender,
      text,
    }

    // send prompt to cohere-ai for response generation
    const prompt = `Help me send a suitable and short reply to this mail:\n\n${snippet}.
                    The sender is ${sender}. Consider the email context using the labels ${labels}.
                    Remember to act like you are sending the mail directly, so don't write extra things.
                    Remember my name is Precious if you need it for the Regards section.`;

    
    cohereResponseText = await cohereRespond(prompt);

    
    // Define response email content
    const emailLines = [];
    emailLines.push(`From: "Sender Name" preciousseemmanuel@gmail.com`);
    emailLines.push(`To: ${sender}`);
    emailLines.push('Content-type: text/html;charset=iso-8859-1');
    emailLines.push('MIME-Version: 1.0');
    emailLines.push(`Subject: ${subject}`);
    emailLines.push('');
    emailLines.push(`<html><body>${cohereResponseText.replace(/\n/g, '<br>')}</body></html>`);

    console.log(emailLines);
    const emailtext = emailLines.join("\n").trim();
    console.log(emailtext);
    const base64EncodedEmail = btoa(emailtext);
    console.log(base64EncodedEmail);

    // send response email
    console.log(Date.now() - timestamp);

    if (labels.includes("UNREAD") && labels.includes("INBOX")) {
      gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: base64EncodedEmail,
        },
      }, (err, res) => {
        if (err) return console.log("The Gmail API returned an error: " + err);
        console.log("Email sent:", res.data);
      });
    }
    console.log(messageObj);

  } catch (error) {
    console.log(error);
  }
}

module.exports = { emails, googleRouter };