const { CohereClient } = require('cohere-ai');
require("dotenv").config();

async function cohereRespond(prompt) {
  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });

  const response = await cohere.chat({
    message: `${prompt}`
  });

  return response.text;
}

module.exports = cohereRespond;